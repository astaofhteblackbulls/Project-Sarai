import React from 'react';
import { useTranslation } from '../context/TranslationContext';

const AboutIndia: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              <span className="block">Discover the</span>
              <span className="block bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Incredible India
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
              A land of diversity, culture, and endless wonders
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                A Tapestry of Cultures
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                India is a vibrant tapestry of cultures, languages, religions, and traditions. From the snow-capped peaks of the Himalayas to the sun-kissed beaches of the south, India offers a diverse range of experiences that captivate travelers from around the world.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                With over 2,000 years of history, India is home to magnificent monuments, ancient temples, bustling markets, and serene landscapes. Each region has its own unique identity, cuisine, and customs, making every visit a new adventure.
              </p>
              <p className="text-lg text-gray-600">
                Whether you're seeking spiritual enlightenment, culinary delights, architectural marvels, or wildlife encounters, India promises an unforgettable journey.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.pexels.com/photos/1534411/pexels-photo-1534411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="India Landscape" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Highlights Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Cultural Highlights
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the rich cultural heritage of India through its festivals, traditions, and art forms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Festivals",
                description: "Experience vibrant celebrations like Diwali, Holi, and Eid that showcase India's cultural diversity",
                icon: "🎉"
              },
              {
                title: "Cuisine",
                description: "Savor the flavors of regional delicacies, from spicy curries to sweet desserts",
                icon: "🍛"
              },
              {
                title: "Art & Craft",
                description: "Discover traditional arts like Madhubani painting, Warli art, and intricate handicrafts",
                icon: "🎨"
              },
              {
                title: "Music & Dance",
                description: "Witness classical dance forms like Bharatanatyam, Kathak, and soulful music traditions",
                icon: "🎭"
              }
            ].map((highlight, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">{highlight.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Diversity Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Regional Diversity
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each region of India offers a unique experience with its own distinct culture and traditions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                region: "North India",
                description: "Home to the majestic Himalayas, historical monuments like the Taj Mahal, and vibrant cities like Delhi and Jaipur",
                image: "https://images.pexels.com/photos/1534412/pexels-photo-153412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                region: "South India",
                description: "Known for its classical temples, backwaters of Kerala, and rich traditions of dance and music",
                image: "https://images.pexels.com/photos/962465/pexels-photo-962465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                region: "East India",
                description: "Famous for its ancient temples, tea gardens of Assam, and the cultural capital of Kolkata",
                image: "https://images.pexels.com/photos/16783938/pexels-photo-16783938/free-photo-of-victoria-memorial-in-kolkata-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                region: "West India",
                description: "Boasts the bustling city of Mumbai, historic forts of Rajasthan, and pristine beaches of Goa",
                image: "https://images.pexels.com/photos/1450355/pexels-photo-1450355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                region: "Northeast India",
                description: "A paradise of biodiversity with lush green valleys, vibrant tribes, and unique cultures",
                image: "https://images.pexels.com/photos/1365427/pexels-photo-1365427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              },
              {
                region: "Central India",
                description: "Rich in wildlife with famous national parks and the ancient temples of Khajuraho",
                image: "https://images.pexels.com/photos/16783939/pexels-photo-16783939/free-photo-of-tiger-statue-in-khajuraho-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              }
            ].map((region, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={region.image} 
                    alt={region.region} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{region.region}</h3>
                  <p className="text-gray-600">{region.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutIndia;