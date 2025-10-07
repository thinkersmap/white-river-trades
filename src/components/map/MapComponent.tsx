"use client";

import { useEffect, useRef, useState } from 'react';
import type { ConstituencyMeta } from "@/types";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { Fill, Stroke, Style } from 'ol/style';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import { fromLonLat } from 'ol/proj';
import proj4 from 'proj4';
import 'ol/ol.css';

// Define the British National Grid projection
proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs");

interface MapComponentProps {
  constituency: ConstituencyMeta & { 
    geometry?: {
      type: string;
      coordinates: number[][][];
    }
  };
}

export default function MapComponent({ constituency }: MapComponentProps) {
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

      // Log the coordinates for debugging
      console.log('Raw coordinates:', constituency.geometry.coordinates[0][0]);

      // Convert coordinates from BNG to WGS84
      const convertedCoordinates = constituency.geometry.coordinates[0].map(coord => {
        try {
          // Swap easting/northing to match BNG convention
          const [easting, northing] = coord;
          // Convert from BNG to WGS84
          const [lon, lat] = proj4('EPSG:27700', 'EPSG:4326', [easting, northing]);
          console.log('Converted:', [easting, northing], 'to', [lon, lat]);
          // Convert to Web Mercator for OpenLayers
          return fromLonLat([lon, lat]);
        } catch (error) {
          console.error('Error converting coordinates:', coord, error);
          throw new Error('Failed to convert coordinates');
        }
      });

      // Create polygon feature
      const polygonFeature = new Feature({
        geometry: new Polygon([convertedCoordinates])
      });

      // Create vector source and layer
      const vectorSource = new VectorSource({
        features: [polygonFeature]
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

      // Create map
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer
        ],
        view: new View({
          center: fromLonLat([-0.28718, 51.38754]), // Use the centroid from GeoJSON properties
          zoom: 12
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
  }, [constituency.geometry]);

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