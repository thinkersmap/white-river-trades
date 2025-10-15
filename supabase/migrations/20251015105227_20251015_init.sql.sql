create table "public"."constituencies" (
    "PCON24CD" text not null,
    "PCON24NM" text not null
);


create table "public"."postcodes_lookup" (
    "postcode" text not null,
    "constituency_code" text,
    "constituency_name" text,
    "region_code" text,
    "region_name" text,
    "latitude" double precision,
    "longitude" double precision
);


create table "public"."roofing_companies" (
    "CompanyName" text,
    "CompanyNumber" text not null,
    "RegAddress.AddressLine1" text,
    "RegAddress.AddressLine2" text,
    "RegAddress.PostTown" text,
    "RegAddress.County" text,
    "RegAddress.PostCode" text,
    "RegAddress.Country" text,
    "CompanyStatus" text,
    "IncorporationDate" date,
    "SICCode.SicText_1" text,
    "URI" text
);


CREATE UNIQUE INDEX constituencies_pkey ON public.constituencies USING btree ("PCON24CD");

CREATE INDEX postcodes_lookup_constituency_idx ON public.postcodes_lookup USING btree (constituency_code);

CREATE UNIQUE INDEX postcodes_lookup_pkey ON public.postcodes_lookup USING btree (postcode);

CREATE INDEX postcodes_lookup_region_idx ON public.postcodes_lookup USING btree (region_code);

CREATE UNIQUE INDEX roofing_companies_pkey ON public.roofing_companies USING btree ("CompanyNumber");

alter table "public"."constituencies" add constraint "constituencies_pkey" PRIMARY KEY using index "constituencies_pkey";

alter table "public"."postcodes_lookup" add constraint "postcodes_lookup_pkey" PRIMARY KEY using index "postcodes_lookup_pkey";

alter table "public"."roofing_companies" add constraint "roofing_companies_pkey" PRIMARY KEY using index "roofing_companies_pkey";

create or replace view "public"."constituencies_with_regions" as  WITH per_const AS (
         SELECT postcodes_lookup.constituency_code,
            min(postcodes_lookup.region_code) AS region_code,
                CASE
                    WHEN (min(postcodes_lookup.region_code) = 'S99999999'::text) THEN 'Scotland'::text
                    WHEN (min(postcodes_lookup.region_code) = 'W99999999'::text) THEN 'Wales'::text
                    WHEN (min(postcodes_lookup.region_code) = 'N99999999'::text) THEN 'Northern Ireland'::text
                    ELSE min(postcodes_lookup.region_name)
                END AS region_name
           FROM postcodes_lookup
          GROUP BY postcodes_lookup.constituency_code
        )
 SELECT c."PCON24CD" AS constituency_code,
    c."PCON24NM" AS constituency_name,
    pc.region_code,
    pc.region_name
   FROM (constituencies c
     LEFT JOIN per_const pc ON ((pc.constituency_code = c."PCON24CD")));


create or replace view "public"."roofing_companies_enriched" as  SELECT c."CompanyName",
    c."CompanyNumber",
    c."RegAddress.AddressLine1",
    c."RegAddress.AddressLine2",
    c."RegAddress.PostTown",
    c."RegAddress.County",
    c."RegAddress.PostCode",
    c."RegAddress.Country",
    c."CompanyStatus",
    c."IncorporationDate",
    c."SICCode.SicText_1",
    c."URI",
    p.constituency_name,
    p.region_name,
    p.latitude,
    p.longitude
   FROM (roofing_companies c
     LEFT JOIN postcodes_lookup p ON ((upper(TRIM(BOTH FROM replace(c."RegAddress.PostCode", ' '::text, ''::text))) = p.postcode)));


grant delete on table "public"."constituencies" to "anon";

grant insert on table "public"."constituencies" to "anon";

grant references on table "public"."constituencies" to "anon";

grant select on table "public"."constituencies" to "anon";

grant trigger on table "public"."constituencies" to "anon";

grant truncate on table "public"."constituencies" to "anon";

grant update on table "public"."constituencies" to "anon";

grant delete on table "public"."constituencies" to "authenticated";

grant insert on table "public"."constituencies" to "authenticated";

grant references on table "public"."constituencies" to "authenticated";

grant select on table "public"."constituencies" to "authenticated";

grant trigger on table "public"."constituencies" to "authenticated";

grant truncate on table "public"."constituencies" to "authenticated";

grant update on table "public"."constituencies" to "authenticated";

grant delete on table "public"."constituencies" to "service_role";

grant insert on table "public"."constituencies" to "service_role";

grant references on table "public"."constituencies" to "service_role";

grant select on table "public"."constituencies" to "service_role";

grant trigger on table "public"."constituencies" to "service_role";

grant truncate on table "public"."constituencies" to "service_role";

grant update on table "public"."constituencies" to "service_role";

grant delete on table "public"."postcodes_lookup" to "anon";

grant insert on table "public"."postcodes_lookup" to "anon";

grant references on table "public"."postcodes_lookup" to "anon";

grant select on table "public"."postcodes_lookup" to "anon";

grant trigger on table "public"."postcodes_lookup" to "anon";

grant truncate on table "public"."postcodes_lookup" to "anon";

grant update on table "public"."postcodes_lookup" to "anon";

grant delete on table "public"."postcodes_lookup" to "authenticated";

grant insert on table "public"."postcodes_lookup" to "authenticated";

grant references on table "public"."postcodes_lookup" to "authenticated";

grant select on table "public"."postcodes_lookup" to "authenticated";

grant trigger on table "public"."postcodes_lookup" to "authenticated";

grant truncate on table "public"."postcodes_lookup" to "authenticated";

grant update on table "public"."postcodes_lookup" to "authenticated";

grant delete on table "public"."postcodes_lookup" to "service_role";

grant insert on table "public"."postcodes_lookup" to "service_role";

grant references on table "public"."postcodes_lookup" to "service_role";

grant select on table "public"."postcodes_lookup" to "service_role";

grant trigger on table "public"."postcodes_lookup" to "service_role";

grant truncate on table "public"."postcodes_lookup" to "service_role";

grant update on table "public"."postcodes_lookup" to "service_role";

grant delete on table "public"."roofing_companies" to "anon";

grant insert on table "public"."roofing_companies" to "anon";

grant references on table "public"."roofing_companies" to "anon";

grant select on table "public"."roofing_companies" to "anon";

grant trigger on table "public"."roofing_companies" to "anon";

grant truncate on table "public"."roofing_companies" to "anon";

grant update on table "public"."roofing_companies" to "anon";

grant delete on table "public"."roofing_companies" to "authenticated";

grant insert on table "public"."roofing_companies" to "authenticated";

grant references on table "public"."roofing_companies" to "authenticated";

grant select on table "public"."roofing_companies" to "authenticated";

grant trigger on table "public"."roofing_companies" to "authenticated";

grant truncate on table "public"."roofing_companies" to "authenticated";

grant update on table "public"."roofing_companies" to "authenticated";

grant delete on table "public"."roofing_companies" to "service_role";

grant insert on table "public"."roofing_companies" to "service_role";

grant references on table "public"."roofing_companies" to "service_role";

grant select on table "public"."roofing_companies" to "service_role";

grant trigger on table "public"."roofing_companies" to "service_role";

grant truncate on table "public"."roofing_companies" to "service_role";

grant update on table "public"."roofing_companies" to "service_role";


