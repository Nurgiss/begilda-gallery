import { AdminNews } from '../../components/AdminNews';

interface News {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

interface NewsManagerProps {
  news: News[];
  onAddNews: (news: Omit<News, 'id'>) => void;
  onEditNews: (news: News) => void;
  onDeleteNews: (id: number) => void;
}

export function NewsManager({ news, onAddNews, onEditNews, onDeleteNews }: NewsManagerProps) {
  return (
    <AdminNews 
      news={news}
      onAddNews={onAddNews}
      onEditNews={onEditNews}
      onDeleteNews={onDeleteNews}
    />
  );
}
