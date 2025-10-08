import {
  HomeModernIcon,
  WrenchScrewdriverIcon,
  BoltIcon,
  PaintBrushIcon,
  WrenchIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  SparklesIcon,
  BuildingOffice2Icon,
  FireIcon,
  TruckIcon,
  TrashIcon,
  RectangleStackIcon,
  HomeIcon,
  GlobeEuropeAfricaIcon,
  CubeTransparentIcon,
  ClipboardDocumentCheckIcon,
  MinusIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export type SubCategory = {
  name: string;
  slug: string;
  description: string;
};

export type Trade = {
  name: string;
  slug: string;
  description: string;
  sicCode: string;
  sicName: string;
  category: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  available: boolean;
  subcategories: SubCategory[];
};

export const trades: Trade[] = [
  // --- Construction Trades ---

{
  name: "Roofing",
  slug: "roofing",
  description: "Professional roof repairs, installations, and maintenance for homes and businesses.",
  sicCode: "43910",
  sicName: "Roofing activities",
  category: "Construction Trades",
  icon: HomeModernIcon,
  available: true,
  subcategories: [
    { name: "Flat roofs", slug: "flat-roofs", description: "Installation and repair of flat roofing systems including felt, rubber, and GRP materials for durability and water resistance." },
    { name: "Pitched roofs", slug: "pitched-roofs", description: "Construction and maintenance of pitched roof structures using tiles or slates for aesthetic and longevity." },
    { name: "Roof cleaning", slug: "roof-cleaning", description: "Safe removal of moss, algae, and debris to maintain your roof’s appearance and lifespan." },
    { name: "Chimney repairs", slug: "chimney-repairs", description: "Repointing, rebuilding, and maintenance of chimneys and flues to ensure structural integrity." },
    { name: "Gutters, fascias & soffits", slug: "gutters-fascias-soffits", description: "Installation and repair of uPVC and aluminium guttering systems, fascia boards, and soffits." },
    { name: "Emergency roof repairs", slug: "emergency-roof-repairs", description: "24/7 response to storm damage, leaks, and urgent roofing issues." },
    { name: "Leadwork & flashing", slug: "leadwork-flashing", description: "Expert installation and restoration of lead flashings and valleys for watertight roofs." },
    { name: "Skylights & dormers", slug: "skylights-dormers", description: "Fitting and maintenance of roof windows and dormer conversions to bring in natural light." },
    { name: "Roof insulation", slug: "roof-insulation", description: "Energy-efficient insulation solutions to reduce heat loss and improve comfort." },
    { name: "Roof inspection reports", slug: "roof-inspection-reports", description: "Detailed surveys and reports to assess roof condition for buyers or insurers." }
  ]
},
{
  name: "Carpentry",
  slug: "carpentry",
  description: "Expert carpentry services for interior and exterior woodwork projects.",
  sicCode: "43390",
  sicName: "Other building completion and finishing",
  category: "Construction Trades",
  icon: WrenchIcon,
  available: true,
  subcategories: [
    { name: "Door hanging", slug: "door-hanging", description: "Precision installation and adjustment of interior and exterior doors for a perfect fit." },
    { name: "Skirting & architraves", slug: "skirting-architraves", description: "Fitting of skirting boards, architraves, and mouldings for a clean interior finish." },
    { name: "Custom furniture", slug: "custom-furniture", description: "Bespoke carpentry projects including shelves, storage, and built-in furniture." },
    { name: "Decking", slug: "decking", description: "Design and installation of hardwood and composite decking for outdoor spaces." },
    { name: "Garden structures", slug: "garden-structures", description: "Timber pergolas, sheds, and gazebos built to specification." },
    { name: "Floor joists & framing", slug: "floor-joists-framing", description: "Structural carpentry including floor joists, timber framing, and supports." }
  ]
},
{
  name: "Joinery",
  slug: "joinery",
  description: "Bespoke joinery for windows, staircases, and fine interior finishes.",
  sicCode: "43320",
  sicName: "Joinery installation",
  category: "Construction Trades",
  icon: Cog6ToothIcon,
  available: true,
  subcategories: [
    { name: "Fitted wardrobes", slug: "fitted-wardrobes", description: "Custom-built wardrobes and cabinetry for efficient use of space." },
    { name: "Staircases", slug: "staircases", description: "Design, manufacture, and installation of bespoke timber staircases." },
    { name: "Windows & frames", slug: "windows-frames", description: "Wooden window frame crafting and installation for heritage or modern homes." },
    { name: "Loft boarding", slug: "loft-boarding", description: "Professional boarding of loft areas for safe storage access." },
    { name: "Bespoke joinery", slug: "bespoke-joinery", description: "Tailor-made woodwork for architectural and decorative purposes." }
  ]
},
{
  name: "Bricklaying & General Building",
  slug: "building",
  description: "Residential and commercial building projects including extensions and renovations.",
  sicCode: "41202",
  sicName: "Construction of domestic buildings",
  category: "Construction Trades",
  icon: BuildingOffice2Icon,
  available: true,
  subcategories: [
    { name: "Extensions", slug: "extensions", description: "Design and construction of single and double-storey home extensions." },
    { name: "Renovations", slug: "renovations", description: "Full or partial home refurbishments with structural and aesthetic improvements." },
    { name: "Garage conversions", slug: "garage-conversions", description: "Transform underused garages into additional living or office space." },
    { name: "Bricklaying", slug: "bricklaying", description: "All aspects of brickwork including walls, paths, and garden features." },
    { name: "Basement conversions", slug: "basement-conversions", description: "Waterproofed basement renovations for additional living or storage space." },
    { name: "Damp proofing", slug: "damp-proofing", description: "Prevention and treatment of rising or penetrating damp in buildings." }
  ]
},
{
  name: "Plastering & Rendering",
  slug: "plastering",
  description: "Smooth finishes and durable rendering for walls and ceilings.",
  sicCode: "43310",
  sicName: "Plastering",
  category: "Construction Trades",
  icon: SparklesIcon,
  available: true,
  subcategories: [
    { name: "Skimming", slug: "skimming", description: "Creating smooth surfaces over old plaster or drywall for decoration." },
    { name: "Dry lining", slug: "dry-lining", description: "Installation of plasterboard and partitions for quick wall construction." },
    { name: "Rendering", slug: "rendering", description: "Exterior wall coatings using cement or silicone renders for weather protection." },
    { name: "Coving & mouldings", slug: "coving-mouldings", description: "Decorative plasterwork for ceilings, cornices, and interior detailing." },
    { name: "Ceiling repairs", slug: "ceiling-repairs", description: "Repairing cracks, sagging, and water damage in ceilings." }
  ]
},
{
  name: "Painting & Decorating",
  slug: "painting",
  description: "Professional painting and decorative finishes for interiors and exteriors.",
  sicCode: "43341",
  sicName: "Painting",
  category: "Construction Trades",
  icon: PaintBrushIcon,
  available: true,
  subcategories: [
    { name: "Interior painting", slug: "interior-painting", description: "High-quality wall and ceiling painting for a perfect finish." },
    { name: "Exterior painting", slug: "exterior-painting", description: "Weather-resistant paintwork for homes and commercial properties." },
    { name: "Wallpapering", slug: "wallpapering", description: "Professional wallpaper installation, pattern matching, and removal." },
    { name: "Decorative finishes", slug: "decorative-finishes", description: "Specialist finishes such as feature walls, murals, and faux effects." },
    { name: "Spray painting", slug: "spray-painting", description: "Airless spray painting for smooth, even coatings on large surfaces." }
  ]
},
{
  name: "Flooring & Tiling",
  slug: "flooring",
  description: "Expert installation of floors and wall tiles to enhance your living spaces.",
  sicCode: "43330",
  sicName: "Floor and wall covering",
  category: "Construction Trades",
  icon: RectangleStackIcon,
  available: true,
  subcategories: [
    { name: "Wood & laminate flooring", slug: "wood-laminate-flooring", description: "Supply and fitting of hardwood, laminate, and engineered floors." },
    { name: "Tile installation", slug: "tile-installation", description: "Professional tiling for kitchens, bathrooms, and floors." },
    { name: "Carpet fitting", slug: "carpet-fitting", description: "Precise carpet cutting and installation for a seamless finish." },
    { name: "Grouting & sealing", slug: "grouting-sealing", description: "Long-lasting waterproof sealing for tiled areas." },
    { name: "Floor sanding", slug: "floor-sanding", description: "Restoration of wooden floors with sanding and refinishing." }
  ]
},
{
  name: "Loft Conversions & Extensions",
  slug: "lofts",
  description: "Transform your attic or loft space into a functional living area.",
  sicCode: "41202",
  sicName: "Construction of domestic buildings",
  category: "Construction Trades",
  icon: HomeIcon,
  available: true,
  subcategories: [
    { name: "Dormer conversions", slug: "dormer-conversions", description: "Add space and light with a dormer extension to your roof." },
    { name: "Mansard conversions", slug: "mansard-conversions", description: "Stylish loft transformations with additional headroom." },
    { name: "Hip-to-gable conversions", slug: "hip-to-gable-conversions", description: "Maximise loft space by extending sloped roofs to full gables." },
    { name: "Attic rooms", slug: "attic-rooms", description: "Convert unused attic space into bedrooms, offices, or studios." }
  ]
},

// --- Home Services ---

{
  name: "Kitchen Fitting",
  slug: "kitchens",
  description: "Professional kitchen installations, refurbishments, and upgrades for homes and landlords.",
  sicCode: "43390",
  sicName: "Other building completion and finishing",
  category: "Home Services",
  icon: ClipboardDocumentCheckIcon,
  available: true,
  subcategories: [
    { name: "Full kitchen installation", slug: "full-kitchen-installation", description: "Complete kitchen fitting including cabinets, appliances, and finishing." },
    { name: "Cabinet fitting", slug: "cabinet-fitting", description: "Installation and alignment of bespoke or flat-pack kitchen units." },
    { name: "Worktop installation", slug: "worktop-installation", description: "Cutting and fitting of laminate, stone, or solid wood kitchen worktops." },
    { name: "Kitchen refurbishment", slug: "kitchen-refurbishment", description: "Upgrading existing kitchens with new doors, handles, and finishes." },
    { name: "Plumbing & electrical connections", slug: "plumbing-electrical-connections", description: "Safe connection of appliances, sinks, and lighting." }
  ]
},
{
  name: "Bathroom Fitting",
  slug: "bathrooms",
  description: "Design, installation, and renovation of modern and traditional bathrooms.",
  sicCode: "43220",
  sicName: "Plumbing, heat and air-conditioning installation",
  category: "Home Services",
  icon: FireIcon,
  available: true,
  subcategories: [
    { name: "Bathroom installation", slug: "bathroom-installation", description: "Complete bathroom fitting including plumbing, tiling, and finishes." },
    { name: "Shower fitting", slug: "shower-fitting", description: "Installation and replacement of showers, trays, and enclosures." },
    { name: "Wet rooms", slug: "wet-rooms", description: "Luxury wet room installations with waterproofing and drainage systems." },
    { name: "Bath replacement", slug: "bath-replacement", description: "Removal and installation of freestanding, corner, or standard baths." },
    { name: "Waterproofing", slug: "waterproofing", description: "Professional sealing and tanking to protect walls and floors from moisture." }
  ]
},
{
  name: "Cleaning & Maintenance",
  slug: "cleaning",
  description: "Comprehensive residential and commercial cleaning services to keep properties spotless.",
  sicCode: "81210",
  sicName: "General cleaning of buildings",
  category: "Home Services",
  icon: SparklesIcon,
  available: true,
  subcategories: [
    { name: "Gutter cleaning", slug: "gutter-cleaning", description: "Clearing blocked gutters to prevent overflow and damp damage." },
    { name: "Pressure washing", slug: "pressure-washing", description: "High-pressure jet washing for driveways, patios, and exterior walls." },
    { name: "Chimney sweeping", slug: "chimney-sweeping", description: "Professional chimney cleaning for safety and efficiency." },
    { name: "End-of-tenancy cleaning", slug: "end-of-tenancy-cleaning", description: "Deep cleaning service for rental properties before new tenants move in." },
    { name: "Carpet cleaning", slug: "carpet-cleaning", description: "Hot water extraction and stain removal for all carpet types." },
    { name: "Domestic & commercial cleaning", slug: "domestic-commercial-cleaning", description: "Regular or one-off cleaning tailored to homes or offices." }
  ]
},
{
  name: "Handyman Services",
  slug: "handyman",
  description: "Trusted general repair and maintenance services for small home projects.",
  sicCode: "43390",
  sicName: "Other building completion and finishing",
  category: "Home Services",
  icon: WrenchScrewdriverIcon,
  available: true,
  subcategories: [
    { name: "Furniture assembly", slug: "furniture-assembly", description: "Flat-pack furniture assembly and installation services." },
    { name: "Mounting & hanging", slug: "mounting-hanging", description: "TVs, mirrors, shelves, and picture hanging with secure fixings." },
    { name: "Small repairs", slug: "small-repairs", description: "Minor plumbing, electrical, and carpentry fixes for everyday issues." },
    { name: "Curtain & blind fitting", slug: "curtain-blind-fitting", description: "Precise installation of curtain poles, blinds, and window fittings." },
    { name: "Door handles & locks", slug: "door-handles-locks", description: "Replacing and repairing interior and exterior door hardware." },
    { name: "General odd jobs", slug: "general-odd-jobs", description: "Flexible help for any minor household task or improvement." }
  ]
},
{
  name: "Windows & Doors",
  slug: "windows",
  description: "Installation and maintenance of doors, windows, and glazing systems.",
  sicCode: "43342",
  sicName: "Glazing",
  category: "Home Services",
  icon: CubeTransparentIcon,
  available: true,
  subcategories: [
    { name: "Window replacement", slug: "window-replacement", description: "Supply and fit of double or triple-glazed windows." },
    { name: "Door fitting", slug: "door-fitting", description: "Expert installation of wooden, composite, and uPVC doors." },
    { name: "Double glazing repairs", slug: "double-glazing-repairs", description: "Sealed unit replacement and misted window repairs." },
    { name: "Conservatories", slug: "conservatories", description: "Design and construction of glass conservatories and orangeries." },
    { name: "Locks & handles", slug: "locks-handles", description: "Replacement of door and window locks, handles, and hinges." },
    { name: "Bifold & sliding doors", slug: "bifold-sliding-doors", description: "Installation of aluminium and uPVC bifold or sliding door systems." }
  ]
},
{
  name: "Security & Smart Systems",
  slug: "security",
  description: "Protect your home or business with smart security and monitoring solutions.",
  sicCode: "80200",
  sicName: "Security systems service activities",
  category: "Home Services",
  icon: ShieldCheckIcon,
  available: true,
  subcategories: [
    { name: "Alarm systems", slug: "alarm-systems", description: "Installation of wired and wireless intruder alarm systems." },
    { name: "CCTV installation", slug: "cctv-installation", description: "Security camera systems for homes, offices, and commercial properties." },
    { name: "Smart locks", slug: "smart-locks", description: "Keyless entry and app-controlled locking systems for modern homes." },
    { name: "Door entry systems", slug: "door-entry-systems", description: "Intercom and video entry installations for enhanced access control." },
    { name: "Smart home setup", slug: "smart-home-setup", description: "Integration of lighting, heating, and security into one connected system." },
    { name: "Intercom systems", slug: "intercom-systems", description: "Audio and video intercom installation for residential or business use." }
  ]
},

// --- Outdoors & Landscaping ---

{
  name: "Gardening & Landscaping",
  slug: "gardening",
  description: "Professional garden care, landscaping, and outdoor design services for every property type.",
  sicCode: "81300",
  sicName: "Landscape service activities",
  category: "Outdoors & Landscaping",
  icon: SparklesIcon,
  available: true,
  subcategories: [
    { name: "Lawn care", slug: "lawn-care", description: "Mowing, feeding, and aerating lawns for healthy grass." },
    { name: "Hedge trimming", slug: "hedge-trimming", description: "Regular hedge cutting and shaping for tidy boundaries." },
    { name: "Tree surgery", slug: "tree-surgery", description: "Professional tree pruning, shaping, and removal." },
    { name: "Fencing & decking", slug: "fencing-decking", description: "Installation and repair of timber or composite fences and decking." },
    { name: "Patios & paving", slug: "patios-paving", description: "Design and laying of paved patios and walkways." },
    { name: "Garden design", slug: "garden-design", description: "Full garden planning and transformation by landscaping experts." },
    { name: "Turfing & planting", slug: "turfing-planting", description: "New lawn turfing, seeding, and garden bed planting." },
    { name: "Ongoing maintenance", slug: "ongoing-maintenance", description: "Scheduled upkeep for residential and commercial gardens." }
  ]
},
{
  name: "Fencing & Gates",
  slug: "fencing",
  description: "Secure and stylish fencing and gate solutions for homes and businesses.",
  sicCode: "43390",
  sicName: "Other building completion and finishing",
  category: "Outdoors & Landscaping",
    icon: MinusIcon,
  available: true,
  subcategories: [
    { name: "Timber fencing", slug: "timber-fencing", description: "Supply and fit of closeboard, panel, or picket fencing." },
    { name: "Metal fencing", slug: "metal-fencing", description: "Installation of wrought iron and steel fencing for added security." },
    { name: "Driveway gates", slug: "driveway-gates", description: "Manual or automated gate installations in wood or metal." },
    { name: "Garden boundaries", slug: "garden-boundaries", description: "Boundary line fencing and property enclosures." },
    { name: "Fence repairs", slug: "fence-repairs", description: "Post replacements, panel fixing, and storm damage repair." }
  ]
},
{
  name: "Driveways & Paving",
  slug: "driveways",
  description: "Beautiful, durable driveways and paved areas built to last.",
  sicCode: "43390",
  sicName: "Other building completion and finishing",
  category: "Outdoors & Landscaping",
  icon: Squares2X2Icon,
  available: true,
  subcategories: [
    { name: "Block paving", slug: "block-paving", description: "Traditional and modern block driveways with pattern designs." },
    { name: "Resin driveways", slug: "resin-driveways", description: "Low-maintenance, attractive resin-bound surfaces." },
    { name: "Gravel & tarmac drives", slug: "gravel-tarmac-drives", description: "Affordable driveways with strong drainage properties." },
    { name: "Patios", slug: "patios", description: "Custom patios for entertaining or relaxing outdoors." },
    { name: "Pathways", slug: "pathways", description: "Stone, concrete, or brick paths for gardens and access routes." },
    { name: "Kerbing", slug: "kerbing", description: "Edging and kerb installations to finish driveways and paths." }
  ]
},
{
  name: "Tree Surgery",
  slug: "tree-surgery",
  description: "Qualified arborists providing safe tree pruning, felling, and maintenance services.",
  sicCode: "81300",
  sicName: "Landscape service activities",
  category: "Outdoors & Landscaping",
  icon: GlobeEuropeAfricaIcon,
  available: true,
  subcategories: [
    { name: "Tree felling", slug: "tree-felling", description: "Safe and controlled removal of large or hazardous trees." },
    { name: "Pruning", slug: "pruning", description: "Crown reduction and shaping to maintain healthy tree growth." },
    { name: "Stump removal", slug: "stump-removal", description: "Grinding and removal of stumps to clear garden areas." },
    { name: "Hedge cutting", slug: "hedge-cutting", description: "Neat trimming and shaping of hedges and bushes." },
    { name: "Emergency callouts", slug: "emergency-callouts", description: "Rapid response for storm-damaged or fallen trees." }
  ]
},
{
  name: "Scaffolding",
  slug: "scaffolding",
  description: "Reliable scaffolding hire and access platforms for construction and repairs.",
  sicCode: "43991",
  sicName: "Scaffold erection",
  category: "Outdoors & Landscaping",
  icon: BuildingOffice2Icon,
  available: true,
  subcategories: [
    { name: "Scaffolding hire", slug: "scaffolding-hire", description: "Short or long-term scaffold hire for residential and commercial projects." },
    { name: "Temporary roofing", slug: "temporary-roofing", description: "Protective coverings to shield worksites from the weather." },
    { name: "Access platforms", slug: "access-platforms", description: "Safe access solutions for building, painting, or roof work." },
    { name: "Tower scaffolds", slug: "tower-scaffolds", description: "Mobile tower systems for smaller construction and maintenance jobs." }
  ]
},

// --- Structural & Specialist Trades ---

{
  name: "General Building & Renovation",
  slug: "building",
  description: "Comprehensive construction, extension, and renovation work for all property types.",
  sicCode: "41202",
  sicName: "Construction of domestic buildings",
  category: "Structural & Specialist Trades",
  icon: HomeModernIcon,
  available: true,
  subcategories: [
    { name: "Extensions", slug: "extensions", description: "Single and double-storey extensions designed and built to your needs." },
    { name: "Loft conversions", slug: "loft-conversions", description: "Turn unused attic space into bedrooms or offices." },
    { name: "Garage conversions", slug: "garage-conversions", description: "Transform garages into practical living or working areas." },
    { name: "Bricklaying", slug: "bricklaying", description: "Brick, block, and stonework for new builds or repairs." },
    { name: "Structural work", slug: "structural-work", description: "Load-bearing wall removals and steel beam installations." },
    { name: "Renovations & refurbishments", slug: "renovations-refurbishments", description: "Full property upgrades and modernisations." },
    { name: "Damp proofing", slug: "damp-proofing", description: "Prevention and repair of moisture ingress and rising damp." },
    { name: "Basements", slug: "basements", description: "Excavation and conversion of basements into usable rooms." }
  ]
},
{
  name: "Plastering & Rendering",
  slug: "plastering",
  description: "High-quality interior plasterwork and durable external rendering services.",
  sicCode: "43310",
  sicName: "Plastering",
  category: "Structural & Specialist Trades",
  icon: PaintBrushIcon,
  available: true,
  subcategories: [
    { name: "Skimming & plaster repairs", slug: "skimming-plaster-repairs", description: "Smooth finishing for walls and ceilings, ideal for decorating." },
    { name: "Ceiling reboarding", slug: "ceiling-reboarding", description: "Replacing damaged or uneven ceilings with fresh plasterboard." },
    { name: "External rendering", slug: "external-rendering", description: "Protective cement or silicone render for exterior walls." },
    { name: "Pebble dashing", slug: "pebble-dashing", description: "Decorative and weather-resistant finish for exterior walls." },
    { name: "Coving & mouldings", slug: "coving-mouldings", description: "Ornamental plaster features for interior decoration." },
    { name: "Dry lining", slug: "dry-lining", description: "Fast and efficient wall boarding for new builds and refurbishments." }
  ]
},
{
  name: "Insulation & Energy Efficiency",
  slug: "insulation",
  description: "Improve comfort and reduce energy bills with modern insulation solutions.",
  sicCode: "43290",
  sicName: "Other construction installation",
  category: "Structural & Specialist Trades",
  icon: FireIcon,
  available: true,
  subcategories: [
    { name: "Loft insulation", slug: "loft-insulation", description: "Energy-saving insulation installed in attic and roof spaces." },
    { name: "Cavity wall insulation", slug: "cavity-wall-insulation", description: "Filling wall cavities to prevent heat loss." },
    { name: "Roof insulation", slug: "roof-insulation", description: "Thermal and sound insulation under pitched or flat roofs." },
    { name: "Draft proofing", slug: "draft-proofing", description: "Sealing gaps around doors and windows to prevent draughts." },
    { name: "Home energy assessments", slug: "home-energy-assessments", description: "Evaluate home energy performance and identify improvements." }
  ]
},
{
  name: "Damp & Waterproofing",
  slug: "damp-proofing",
  description: "Protect properties from water damage, rising damp, and mould with expert treatments.",
  sicCode: "43999",
  sicName: "Other specialised construction activities n.e.c.",
  category: "Structural & Specialist Trades",
  icon: ShieldCheckIcon,
  available: true,
  subcategories: [
    { name: "Rising damp treatment", slug: "rising-damp-treatment", description: "Injection or membrane-based solutions for rising damp." },
    { name: "Basement waterproofing", slug: "basement-waterproofing", description: "Internal and external waterproofing for basements and cellars." },
    { name: "Mould removal", slug: "mould-removal", description: "Cleaning and treatment to prevent fungal regrowth." },
    { name: "Tanking", slug: "tanking", description: "Protective waterproof coatings for below-ground walls and floors." },
    { name: "Condensation control", slug: "condensation-control", description: "Ventilation and dehumidification systems to prevent damp." }
  ]
},
{
  name: "Loft Conversions & Extensions",
  slug: "lofts",
  description: "Expand living space with professional loft conversions and property extensions.",
  sicCode: "41202",
  sicName: "Construction of domestic buildings",
  category: "Structural & Specialist Trades",
  icon: HomeModernIcon,
  available: true,
  subcategories: [
    { name: "Dormer conversions", slug: "dormer-conversions", description: "Add extra headroom and space with a dormer extension." },
    { name: "Hip-to-gable", slug: "hip-to-gable", description: "Transform sloped roofs to vertical walls for larger loft areas." },
    { name: "Mansard conversions", slug: "mansard-conversions", description: "Maximise attic space with elegant mansard-style extensions." },
    { name: "Attic rooms", slug: "attic-rooms", description: "Convert lofts into bedrooms, offices, or playrooms." },
    { name: "Insulation & stairs", slug: "insulation-stairs", description: "Proper insulation and access solutions for comfort and safety." }
  ]
},

// --- Energy, Mechanical & Waste ---

{
  name: "Heating & Air Conditioning (HVAC)",
  slug: "hvac",
  description: "Installation and maintenance of efficient heating, cooling, and ventilation systems.",
  sicCode: "43220",
  sicName: "Plumbing, heat and air-conditioning installation",
  category: "Energy, Mechanical & Waste",
  icon: FireIcon,
  available: true,
  subcategories: [
    { name: "Air conditioning installation", slug: "air-conditioning-installation", description: "Design and installation of cooling and ventilation systems." },
    { name: "Heat pumps", slug: "heat-pumps", description: "Energy-efficient air and ground source heat pump installations." },
    { name: "Ventilation systems", slug: "ventilation-systems", description: "Mechanical ventilation and air recovery (MVHR) solutions." },
    { name: "Boiler servicing", slug: "boiler-servicing", description: "Routine maintenance and safety checks for gas and oil boilers." },
    { name: "Climate control", slug: "climate-control", description: "Integrated temperature management systems for homes and offices." }
  ]
},
{
  name: "Solar & Renewables",
  slug: "renewables",
  description: "Harness renewable energy with solar, battery, and EV charging installations.",
  sicCode: "43210",
  sicName: "Electrical installation",
  category: "Energy, Mechanical & Waste",
  icon: BoltIcon,
  available: true,
  subcategories: [
    { name: "Solar panel installation", slug: "solar-panel-installation", description: "Design and installation of residential and commercial solar systems." },
    { name: "Battery storage", slug: "battery-storage", description: "Store excess energy with lithium battery systems for home and business use." },
    { name: "EV charging", slug: "ev-charging", description: "Installation of electric vehicle charging points at homes or workplaces." },
    { name: "Energy monitoring", slug: "energy-monitoring", description: "Smart monitoring systems for tracking energy efficiency and savings." },
    { name: "Off-grid systems", slug: "off-grid-systems", description: "Independent renewable setups for remote or eco-conscious properties." }
  ]
},
{
  name: "Waste & Skip Hire",
  slug: "waste",
  description: "Eco-friendly waste removal and skip hire services for homes and construction sites.",
  sicCode: "38110",
  sicName: "Collection of non-hazardous waste",
  category: "Energy, Mechanical & Waste",
  icon: TrashIcon,
  available: true,
  subcategories: [
    { name: "Skip hire", slug: "skip-hire", description: "Various skip sizes available for domestic and commercial waste." },
    { name: "Rubbish removal", slug: "rubbish-removal", description: "On-demand waste collection and clearance services." },
    { name: "Garden waste clearance", slug: "garden-waste-clearance", description: "Removal of soil, branches, and garden waste after landscaping." },
    { name: "Construction waste", slug: "construction-waste", description: "Safe removal of rubble, plaster, and building site waste." },
    { name: "Recycling services", slug: "recycling-services", description: "Environmentally responsible waste processing and recycling." }
  ]
},
{
  name: "Removals & Storage",
  slug: "removals",
  description: "Stress-free house moves and professional storage solutions.",
  sicCode: "49420",
  sicName: "Removal services",
  category: "Energy, Mechanical & Waste",
  icon: TruckIcon,
  available: true,
  subcategories: [
    { name: "House removals", slug: "house-removals", description: "Full or partial home moving services with packing and transport." },
    { name: "Packing services", slug: "packing-services", description: "Careful packing and unpacking for safe transportation of goods." },
    { name: "Storage solutions", slug: "storage-solutions", description: "Short and long-term storage for furniture and household items." },
    { name: "Furniture moving", slug: "furniture-moving", description: "Single-item or full furniture relocation services." },
    { name: "Commercial moves", slug: "commercial-moves", description: "Office and business relocation services with minimal downtime." }
  ]
}]