import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, X, MessageSquare } from 'lucide-react';
import { CustomerReview } from '../types/restaurant';
import { INITIAL_REVIEWS } from '../data/reviewsData';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('vca_customer_reviews');
      if (saved) {
        const parsed: CustomerReview[] = JSON.parse(saved);
        const cleanReviews = parsed.filter(r => 
          !['rev-1', 'rev-2', 'rev-3', 'rev-4'].includes(r.id) &&
          !r.author?.toLowerCase().includes('rahul deshmukh') &&
          !r.author?.toLowerCase().includes('sneha kadam') &&
          !r.author?.toLowerCase().includes('vikram rathod') &&
          !r.author?.toLowerCase().includes('pooja shinde')
        );
        return cleanReviews;
      }
      return INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for genuine new review
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [favoriteDish, setFavoriteDish] = useState('');

  // Persist reviews to localStorage
  useEffect(() => {
    localStorage.setItem('vca_customer_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      location: location.trim() || 'I.C. Colony, Mumbai',
      rating,
      date: 'Today',
      comment: comment.trim(),
      favoriteDish: favoriteDish.trim() || 'Chinese Special',
      verifiedOrder: true,
    };

    setReviews([newRev, ...reviews]);
    setIsModalOpen(false);
    setAuthor('');
    setLocation('');
    setComment('');
    setFavoriteDish('');
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold mb-2">
              <MessageSquare className="w-4 h-4" />
              <span>Customer Feedback</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Customer Ratings & Reviews
            </h2>
            <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-xl">
              Authentic dining feedback from customers at Vikas Chinese Adda, Shop No. 5, Gali No. 3, Ganpati Nagar, New Link Road, I.C. Colony (Pin 400103).
            </p>
          </div>

          <div className="flex items-center gap-4">
            {averageRating && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <span className="font-mono text-xl font-bold text-amber-500">{averageRating}</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(Number(averageRating)) ? 'fill-amber-400' : 'text-stone-300 dark:text-stone-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
            <MessageSquare className="w-10 h-10 mx-auto text-stone-400 mb-3" />
            <h3 className="font-display text-base font-bold text-stone-800 dark:text-stone-200">
              No customer reviews submitted yet
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto mt-1 mb-4">
              Have you tried our Triple Schezwan Rice, Paneer Chilly, or Hakka Noodles? Click below to share your experience!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-stone-900 dark:bg-stone-750 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Be the First to Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/90 dark:border-stone-750 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-stone-400">{rev.date}</span>
                  </div>

                  <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  {rev.favoriteDish && (
                    <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-750 text-xs text-amber-700 dark:text-amber-400">
                      <span className="text-stone-400">Favorite: </span>
                      <strong className="font-medium">{rev.favoriteDish}</strong>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {rev.author}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {rev.location}
                    </div>
                  </div>

                  {rev.verifiedOrder && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Customer</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Write a review modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-display font-bold text-lg text-stone-900 dark:text-stone-100">
                Write a Review
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Area / Locality (e.g. I.C. Colony / Ganpati Nagar)
                </label>
                <input
                  type="text"
                  placeholder="e.g. I.C. Colony, Borivali / Dahisar"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400' : 'text-stone-300 dark:text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold ml-2 text-stone-700 dark:text-stone-300">
                    {rating} out of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Dish You Ordered (Optional)
                </label>
                <input
                  type="text"
                  value={favoriteDish}
                  onChange={(e) => setFavoriteDish(e.target.value)}
                  placeholder="e.g. Triple Schezwan Rice / Paneer Chilly"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Your Feedback *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about the taste, portion, spice level, and pure veg food quality..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
