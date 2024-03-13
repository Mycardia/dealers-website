export interface PartnerLogo {
  id: number;
  shopfront_id: number;
  partner_name: string | null;
  partner_logo: string;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  full_partner_logo_path: string;
}

export interface TextBlock {
  id: number;
  shopfront_id: number;
  title: string;
  description: string;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface HomePageCMS {
  id: number;
  dealer_id: number;
  dealer: string;
  domain: string | null;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  is_review_enabled: number;
  rate_of_interest: number;
  logo: string;
  banner_image: string;
  favicon: string;
  status: number;
  meta_title: null | string;
  meta_description: null | string;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  full_banner_path: string;
  full_logo_path: string;
  full_favicon_path: string;
  backgroundImage: { 'background-image': string };
  themes: {
    brand_color: string;
    navbar_bg_color: string;
    navbar_text_color: string;
    latest_cars_section_bg_color: string;
    latest_cars_section_text_color: string;
    happy_customer_section_bg_color: string;
    happy_customer_section_text_color: string;
    our_advantages_section_bg_color: string;
    our_advantages_section_text_color: string;
    our_services_section_bg_color: string;
  };
  emailUrl: string;
  phoneUrl: string;
  textBlocks: TextBlock[];
  partnerLogos: PartnerLogo[];
  services_page_title: string;
}
