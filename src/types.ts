export type PageId = 
  | 'home'
  | 'tools'
  | 'bg-remover'
  | 'compressor'
  | 'resizer'
  | 'jpg-to-png'
  | 'image-to-pdf'
  | 'pdf-to-image'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms';

export interface ToolItem {
  id: PageId;
  name: string;
  category: 'AI Vision' | 'Image Utilities' | 'PDF Operations';
  shortDesc: string;
  description: string;
  iconName: string;
  badge?: string;
  features: string[];
  gradient: string;
  popular?: boolean;
}
