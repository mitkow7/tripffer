import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    {
      title: 'Booking & Reservations',
      icon: '📅',
      articles: 12,
      description: 'Everything about making and managing your bookings'
    },
    {
      title: 'Payment & Pricing',
      icon: '💳',
      articles: 8,
      description: 'Payment methods, pricing, and billing questions'
    },
    {
      title: 'Travel Documents',
      icon: '📄',
      articles: 6,
      description: 'Passports, visas, and required documentation'
    },
    {
      title: 'Cancellations & Refunds',
      icon: '↩️',
      articles: 10,
      description: 'Cancellation policies and refund processes'
    },
    {
      title: 'Travel Insurance',
      icon: '🛡️',
      articles: 5,
      description: 'Protection for your trips and coverage options'
    },
    {
      title: 'Account Management',
      icon: '👤',
      articles: 7,
      description: 'Managing your profile and account settings'
    }
  ];

  const faqs = [
    {
      question: 'How do I cancel my booking?',
      answer: 'You can cancel your booking by logging into your account and navigating to "My Bookings". Click on the trip you want to cancel and select "Cancel Booking". Please note that cancellation policies vary by provider and may include fees.'
    },
    {
      question: 'When will I be charged for my booking?',
      answer: 'Payment timing depends on the provider and trip type. Most bookings require immediate payment, while some may offer payment plans. You\'ll see the exact payment terms during the booking process.'
    },
    {
      question: 'Can I modify my booking after confirmation?',
      answer: 'Modifications depend on the provider\'s policies. Some bookings allow changes for a fee, while others may not permit modifications. Contact our support team for assistance with specific booking changes.'
    },
    {
      question: 'What happens if my flight is delayed or cancelled?',
      answer: 'If your flight is affected, contact both the airline and our support team immediately. We\'ll help coordinate with tour providers and assist with rebooking or alternative arrangements when possible.'
    },
    {
      question: 'Do I need travel insurance?',
      answer: 'While not required, we highly recommend travel insurance to protect against unexpected events like trip cancellations, medical emergencies, or lost luggage. We offer comprehensive coverage options during booking.'
    },
    {
      question: 'How do I add special requests to my booking?',
      answer: 'You can add special requests during the booking process or by contacting our support team after booking. Common requests include dietary restrictions, accessibility needs, or room preferences.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. Some providers may offer additional payment options like installment plans.'
    },
    {
      question: 'How do I know if my booking is confirmed?',
      answer: 'You\'ll receive a confirmation email immediately after booking with your booking reference number. You can also check your booking status in your account dashboard at any time.'
    }
  ];

  const popularArticles = [
    'How to prepare for international travel',
    'Understanding travel insurance coverage',
    'Packing tips for different destinations',
    'What to do if you lose your passport abroad',
    'How to find the best travel deals',
    'Managing jet lag and travel fatigue'
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How can we help you?
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Find answers to your questions and get the support you need
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Get instant help from our support team</p>
            <Button size="sm">Start Chat</Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Speak directly with our experts</p>
            <Button size="sm" variant="outline">1-800-TRIPFFER</Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Send us a detailed message</p>
            <Button size="sm" variant="outline">Send Email</Button>
          </Card>
        </div>

        {/* Help Categories */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card key={index} hover className="p-6 cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600">{category.articles} articles</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedFaq === index ? 'transform rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {filteredFaqs.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No results found for "{searchQuery}"</p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Popular Articles */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Popular Articles</h3>
              <div className="space-y-3">
                {popularArticles.map((article, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block text-blue-600 hover:text-blue-700 text-sm hover:underline"
                  >
                    {article}
                  </a>
                ))}
              </div>
            </Card>

            {/* Contact Hours */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Support Hours</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">24/7 Live Chat</div>
                    <div className="text-sm text-gray-600">Always available</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Phone Support</div>
                    <div className="text-sm text-gray-600">Mon-Fri: 6AM-10PM EST</div>
                    <div className="text-sm text-gray-600">Sat-Sun: 8AM-8PM EST</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Email Support</div>
                    <div className="text-sm text-gray-600">Response within 24 hours</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="p-6 bg-red-50 border-red-200">
              <h3 className="text-xl font-semibold text-red-900 mb-4">Emergency Support</h3>
              <p className="text-red-700 text-sm mb-4">
                If you're currently traveling and need immediate assistance:
              </p>
              <Button variant="danger" size="sm" className="w-full">
                Call Emergency Line
              </Button>
              <p className="text-xs text-red-600 mt-2 text-center">
                Available 24/7 for urgent travel issues
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;