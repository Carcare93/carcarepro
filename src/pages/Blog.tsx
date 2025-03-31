
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const BLOG_POSTS = [
  {
    id: '1',
    title: 'How Often Should You Change Your Oil?',
    excerpt: 'We break down the factors that affect your oil change schedule.',
    date: '2023-06-15',
    author: 'Jane Smith'
  },
  {
    id: '2',
    title: 'Summer Maintenance Tips for Your Car',
    excerpt: 'Keep your vehicle running smoothly during the hot months.',
    date: '2023-05-22',
    author: 'John Doe'
  },
  {
    id: '3',
    title: 'Understanding Your Check Engine Light',
    excerpt: 'What those dashboard warnings really mean for your vehicle.',
    date: '2023-04-10',
    author: 'Mike Johnson'
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-10">
        <h1 className="text-3xl font-bold mb-6">Auto Maintenance Blog</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Tips, advice, and information to help you care for your vehicle.
        </p>
        
        <div className="space-y-8">
          {BLOG_POSTS.map(post => (
            <article key={post.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-semibold mb-2">
                <Link to={`/blog/${post.id}`} className="hover:text-primary">
                  {post.title}
                </Link>
              </h2>
              <div className="text-sm text-muted-foreground mb-4">
                {post.date} • {post.author}
              </div>
              <p className="mb-4">{post.excerpt}</p>
              <Link to={`/blog/${post.id}`} className="text-primary hover:underline">
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
