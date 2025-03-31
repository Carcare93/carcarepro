
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const BlogArticle = () => {
  const { articleId } = useParams<{ articleId: string }>();
  
  // In a real app, you would fetch the article data from an API
  const article = {
    id: articleId,
    title: 'How Often Should You Change Your Oil?',
    date: 'June 15, 2023',
    author: 'Jane Smith',
    content: `
      <p>Regular oil changes are essential for keeping your engine running smoothly. But how often should you really be changing your oil?</p>
      
      <p>The traditional recommendation has been every 3,000 miles or 3 months, whichever comes first. However, with modern engines and improved oil formulations, many vehicles can go 5,000, 7,500, or even 10,000 miles between changes.</p>
      
      <h3>Factors That Affect Your Oil Change Schedule</h3>
      
      <ul>
        <li>Driving conditions (stop-and-go traffic vs. highway driving)</li>
        <li>Climate and temperature extremes</li>
        <li>Vehicle age and mileage</li>
        <li>Type of oil used (conventional vs. synthetic)</li>
        <li>Your driving habits</li>
      </ul>
      
      <p>The best advice is to consult your owner's manual for the manufacturer's recommendation for your specific vehicle. Many modern cars also have oil life monitoring systems that will alert you when it's time for a change.</p>
      
      <h3>Signs You Might Need an Oil Change</h3>
      
      <ul>
        <li>Oil appears dark and dirty on the dipstick</li>
        <li>Engine making more noise than usual</li>
        <li>Oil change or check engine light comes on</li>
        <li>Decreased fuel efficiency</li>
      </ul>
      
      <p>Remember, regular oil changes are one of the most cost-effective ways to extend the life of your vehicle and avoid expensive repairs down the road.</p>
    `
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-10">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
            ← Back to Blog
          </Link>
          
          <article>
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <div className="text-sm text-muted-foreground mb-8">
              {article.date} • {article.author}
            </div>
            
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogArticle;
