export interface AboutUs {
  id: number;
  dealer_id: number;
  title: string;
  subtitle: string;
  content: string;
  banner_image: string;
  fb_link: string;
  insta_link: string;
  ln_link: string;
  created_at: string;
  contentHtml: string;
  backgroundImage: { 'background-image': string };
}
export interface ServiceContentBlock {
  id: number;
  menu_title: string;
  content_title: string;
  description: string;
  descriptionHtml: string;
}
export interface OurService {
  id: number;
  dealer_id: number;
  shopfront_id: number;
  services_page_title: string;
  services_banner_image: string;
  full_service_banner_path: string;
  backgroundImage: { 'background-image': string };
  cmsServices: ServiceContentBlock[];
}
