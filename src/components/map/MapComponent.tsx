"use client";

import { useEffect, useRef, useState } from 'react';
import type { ConstituencyMeta } from "@/types";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { Fill, Stroke, Style, Circle } from 'ol/style';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import proj4 from 'proj4';
import 'ol/ol.css';

// Define the British National Grid projection
proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs");

interface CompanyMarker {
  CompanyName: string;
  "RegAddress.PostCode": string | null;
  IncorporationDate: string | null;
  constituency_name: string;
  latitude: number | null;
  longitude: number | null;
}

interface MapComponentProps {
  constituency: ConstituencyMeta & { 
    geometry?: {
      type: string;
      coordinates: number[][][];
    }
  };
  companies?: CompanyMarker[];
}

export default function MapComponent({ constituency, companies = [] }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    
    if (!constituency.geometry) {
      setError("Could not load constituency boundary");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const geometry = constituency.geometry as {
        type: 'Polygon' | 'MultiPolygon';
        coordinates: number[][][] | number[][][][];
      };
      const type: 'Polygon' | 'MultiPolygon' = geometry.type;
      const coords: number[][][] | number[][][][] = geometry.coordinates;

      // Normalize to array of linear rings (each ring is array of [x,y])
      let rings: number[][][] = [];
      if (type === 'Polygon') {
        const polyCoords = coords as number[][][];
        rings = polyCoords || [];
      } else if (type === 'MultiPolygon') {
        const multiCoords = coords as number[][][][];
        // Flatten one level: [[ring[]], [ring[]], ...] => [ring[], ring[], ...]
        rings = multiCoords.flat(1);
      } else {
        throw new Error(`Unsupported geometry type: ${type}`);
      }

      if (!rings.length) {
        throw new Error('No rings found in geometry');
      }

      // Helper to detect if coordinate looks like lon/lat (WGS84)
      const isLonLat = (x: number, y: number) =>
        Number.isFinite(x) && Number.isFinite(y) && x >= -180 && x <= 180 && y >= -90 && y <= 90;

      // Convert each ring to Web Mercator
      const features: Feature[] = [];
      for (const ring of rings) {
        const convertedRing = ring
          .map((pt: number[] | null | undefined) => {
            const [x, y] = Array.isArray(pt) ? pt : [NaN, NaN];
            if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
            try {
              if (isLonLat(x, y)) {
                // Already WGS84
                return fromLonLat([x, y]);
              }
              // Assume BNG (EPSG:27700) and convert to WGS84 first
              const [lon, lat] = proj4('EPSG:27700', 'EPSG:4326', [x, y]);
              if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
              return fromLonLat([lon, lat]);
            } catch (err) {
              console.error('Error converting point:', pt, err);
              return null;
            }
          })
          .filter((p): p is [number, number] => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]));

        if (convertedRing.length >= 3) {
          features.push(
            new Feature({
              geometry: new Polygon([convertedRing]),
            })
          );
        }
      }

      if (!features.length) {
        throw new Error('No valid polygon rings after conversion');
      }

      // Create vector source and layer
      const vectorSource = new VectorSource({
        features,
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: '#4338ca',
            width: 2
          }),
          fill: new Fill({
            color: 'rgba(99, 102, 241, 0.1)'
          })
        })
      });

      // Create company markers
      const companyFeatures: Feature[] = [];
      companies.forEach((company) => {
        if (company.latitude && company.longitude) {
          const companyFeature = new Feature({
            geometry: new Point(fromLonLat([company.longitude, company.latitude])),
            name: company.CompanyName
          });
          
          companyFeatures.push(companyFeature);
        }
      });

      const companySource = new VectorSource({
        features: companyFeatures
      });

      const companyLayer = new VectorLayer({
        source: companySource,
        style: new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({
              color: '#ef4444' // Red color for company markers
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 2
            })
          })
        })
      });

      // Create map
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer,
          companyLayer
        ],
        view: new View({
          center: fromLonLat([-0.1, 51.5]),
          zoom: 8
        })
      });

      // Fit to the boundary
      const extent = vectorSource.getExtent();
      map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        maxZoom: 14,
        duration: 1000 // Smooth animation
      });

      // Store map instance for cleanup
      mapInstanceRef.current = map;
      setIsLoading(false);

    } catch (error) {
      console.error('Error setting up map:', error);
      setError('Failed to display constituency boundary');
      setIsLoading(false);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
      }
    };
  }, [constituency.geometry, companies]);

  if (error) {
    return (
      <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl" style={{ minHeight: "400px" }}>
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}
    </div>
  );
}