export interface ReviewItem {
  id: number;
  dealer_id: number;
  name: string;
  title: string;
  description: string;
  descriptionHTML: string;
  created_at: string;
  status: string;
  rating: number;
  formattedDate: string;
  contentBox: {
    scrollHeight: number;
    clientHeight: number;
    showMore: boolean;
  },
}
