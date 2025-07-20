import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Globe,
  Users,
  Headphones,
} from "lucide-react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      detail: "Average response time: 2 minutes",
      action: "Start Chat",
      available: true,
      color: "blue",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our travel experts",
      detail: "1-800-TRIPFFER (1-800-874-7337)",
      action: "Call Now",
      available: true,
      color: "green",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      detail: "support@tripffer.com",
      action: "Send Email",
      available: true,
      color: "purple",
    },
  ];

  const offices = [
    {
      city: "New York",
      address: "123 Broadway, Suite 456\nNew York, NY 10001",
      phone: "+1 (212) 555-0123",
      hours: "Mon-Fri: 9AM-6PM EST",
    },
    {
      city: "San Francisco",
      address: "456 Market Street, Floor 12\nSan Francisco, CA 94102",
      phone: "+1 (415) 555-0456",
      hours: "Mon-Fri: 9AM-6PM PST",
    },
    {
      city: "London",
      address: "789 Oxford Street\nLondon W1C 1JN, UK",
      phone: "+44 20 7946 0789",
      hours: "Mon-Fri: 9AM-5PM GMT",
    },
  ];

  const categories = [
    "General Inquiry",
    "Booking Support",
    "Payment Issues",
    "Cancellation/Refund",
    "Travel Documents",
    "Technical Support",
    "Partnership Inquiry",
    "Media/Press",
    "Other",
  ];

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Replace with your actual API call
      setIsSubmitted(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      reset();

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      // setError("Failed to send message. Please try again later.");
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              We're here to help you plan the perfect trip. Reach out to our
              team of travel experts for personalized assistance and support.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Methods */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Preferred Contact Method
            </h2>
            <p className="text-xl text-gray-600">
              We offer multiple ways to get the help you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} hover className="p-8 text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-${method.color}-100 rounded-full mb-6`}
                >
                  <method.icon className={`w-8 h-8 text-${method.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {method.title}
                </h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <p className="text-sm text-gray-500 mb-6">{method.detail}</p>
                <Button
                  className={`w-full bg-${method.color}-600 hover:bg-${method.color}-700`}
                  disabled={!method.available}
                >
                  {method.action}
                </Button>
                {method.available && (
                  <div className="flex items-center justify-center mt-3 text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Available now</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      Message sent successfully!
                    </span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    {...register("name", { required: "Name is required" })}
                    error={errors.name?.message}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    error={errors.email?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Subject"
                    {...register("subject", {
                      required: "Subject is required",
                    })}
                    error={errors.subject?.message}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      {...register("category", {
                        required: "Please select a category",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    {...register("message", {
                      required: "Message is required",
                    })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide as much detail as possible..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Support Hours */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Support Hours
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Live Chat</div>
                    <div className="text-gray-600">24/7 - Always available</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Phone Support
                    </div>
                    <div className="text-gray-600">
                      Monday - Friday: 6AM - 10PM EST
                    </div>
                    <div className="text-gray-600">
                      Saturday - Sunday: 8AM - 8PM EST
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Email Support
                    </div>
                    <div className="text-gray-600">
                      Response within 24 hours
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Office Locations */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Our Offices
              </h3>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {office.city}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                        <div className="whitespace-pre-line">
                          {office.address}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{office.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{office.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Why Choose Our Support
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Headphones className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Expert Travel Advisors
                    </div>
                    <div className="text-sm text-gray-600">
                      Trained professionals with travel expertise
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Multilingual Support
                    </div>
                    <div className="text-sm text-gray-600">
                      Available in 12 languages
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      98% Satisfaction Rate
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on customer feedback
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
