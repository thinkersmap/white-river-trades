import { 
  HomeModernIcon,
  WrenchScrewdriverIcon,
  BoltIcon,
  SparklesIcon,
  WrenchIcon,
  PaintBrushIcon,
  BeakerIcon,
  HomeIcon
} from "@heroicons/react/24/outline";

export type Trade = {
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  available: boolean;
};

export const trades: Trade[] = [
  { 
    name: "Roofing",
    description: "Roof repairs, installations & maintenance",
    icon: HomeModernIcon,
    available: true 
  },
  { 
    name: "Plumbing",
    description: "Boiler repairs, pipes & heating systems",
    icon: WrenchScrewdriverIcon,
    available: false 
  },
  { 
    name: "Electrical",
    description: "Rewiring, installations & safety checks",
    icon: BoltIcon,
    available: false 
  },
  { 
    name: "Gardening",
    description: "Garden maintenance, landscaping & design",
    icon: SparklesIcon,
    available: false 
  },
  { 
    name: "Carpentry",
    description: "Custom furniture, repairs & installations",
    icon: WrenchIcon,
    available: false 
  },
  { 
    name: "Painting",
    description: "Interior & exterior painting services",
    icon: PaintBrushIcon,
    available: false 
  },
  { 
    name: "Kitchen Fitting",
    description: "Kitchen design, installation & renovation",
    icon: BeakerIcon,
    available: false 
  },
  { 
    name: "Bathroom Fitting",
    description: "Bathroom installation & refurbishment",
    icon: HomeIcon,
    available: false 
  },
];
