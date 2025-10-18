import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Shield, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Sparkles,
  Globe,
  Lock,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    if (currentUser) {
      // User is logged in, redirect to dashboard
      navigate('/dashboard');
    } else {
      // User is not logged in, redirect to login
      navigate('/login');
    }
  };

  const features = [
    {
      icon: Heart,
      title: "Community Support",
      description: "Strengthening bonds through mutual financial assistance",
      color: "text-red-500"
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Blockchain-inspired transparency with bank-grade security",
      color: "text-blue-500"
    },
    {
      icon: Users,
      title: "Collaborative Management",
      description: "Democratic decision-making for fund allocation",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      description: "Real-time insights into fund performance and contributions",
      color: "text-purple-500"
    }
  ];

  const stats = [
    { label: "Active Members", value: "150+", icon: Users },
    { label: "Fund Disbursed", value: "₹2.5M+", icon: TrendingUp },
    { label: "Successful Marriages", value: "45+", icon: Heart },
    { label: "Trust Score", value: "98%", icon: Star }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Community Member",
      content: "The CBMS system made our wedding dreams come true. The transparency and support are unmatched.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Fund Administrator", 
      content: "Managing funds has never been easier. The platform is intuitive and secure.",
      rating: 5
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-y-auto">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden" role="banner">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="relative">
          <div className="container mx-auto px-4 py-24 sm:py-32">
            <div className={cn(
              "text-center space-y-8 transition-all duration-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Community-Powered • Secure • Transparent
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                CBMS Marriage Fund
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed text-readability">
                Empowering communities through collaborative financial support. 
                <span className="font-semibold text-slate-900 dark:text-slate-100"> Secure, transparent, and built for trust.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus-ring"
                  aria-label="Get started with CBMS Marriage Fund"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content starts here */}
      <main id="main-content">
        {/* Stats Section */}
        <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm" role="region" aria-label="Community Statistics">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={cn(
                "text-center space-y-2 transition-all duration-700 delay-100",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                <stat.icon className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100" aria-label={`${stat.value} ${stat.label}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24" role="region" aria-label="Features">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Why Choose CBMS?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-readability">
              Built with modern technology and community values at its core
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={cn(
                "group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )} style={{ transitionDelay: `${index * 100}ms` }}>
                <CardContent className="p-8 text-center space-y-4">
                  <div className={cn("w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300", feature.color)}>
                    <feature.icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-readability">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Community Voices
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Real stories from our community members
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
            <CardContent className="p-12 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Ready to Join Our Community?
                </h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Become part of a trusted network that supports each other through life's important milestones.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  onClick={handleGetStarted}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 dark:bg-slate-950 text-white" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">CBMS Marriage Fund</h3>
              <p className="text-slate-400 text-readability">
                Empowering communities through collaborative financial support.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <nav>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors focus-ring rounded">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors focus-ring rounded">Security</a></li>
                  <li><a href="#" className="hover:text-white transition-colors focus-ring rounded">Support</a></li>
                </ul>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Community</h4>
              <nav>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors focus-ring rounded">Guidelines</a></li>
                  <li><a href="#" className="hover:text-white transition-colors focus-ring rounded">Success Stories</a></li>
                  <li><a href="#" className="hover:text-white transition-colors focus-ring rounded">Help Center</a></li>
                </ul>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Connect</h4>
              <nav>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors focus-ring rounded">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors focus-ring rounded">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors focus-ring rounded">Terms of Service</a></li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 CBMS Marriage Fund. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
