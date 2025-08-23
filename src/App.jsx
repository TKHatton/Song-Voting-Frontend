import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Heart, Share2, ExternalLink, Users, Clock, Trophy, Instagram, Linkedin, Twitter, Facebook, Play, Vote } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// API base URL - will work with both development and production
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';

// Featured original song (not for voting)
const featuredVideo = {
  title: "We Rewrite the Light - Original Theme Song",
  creator: "Lenise Kenney",
  linkedinUrl: "https://www.linkedin.com/in/lenise-kenney",
  description: "The original SHE IS AI theme song that inspired this competition",
  videoUrl: "/LeniseKenneySHEISAISoundtrack.mp4",
  thumbnailUrl: "/thumbnails/lenise-kenney.jpg",
  duration: "3:45",
  isFeatured: true
};

// Competition video submissions (alphabetical order)
const videoSubmissions = [
  {
    id: 1,
    title: "We Rewrite the Light",
    creator: "Alice Kranaviter",
    linkedinUrl: "https://it.linkedin.com/in/alice-kranaviter-7390b946",
    description: "A creative interpretation of the SHE IS AI theme song",
    videoUrl: "/AliceKranaviter.mov",
    thumbnailUrl: "/thumbnails/alice-kranaviter.jpg",
    duration: "3:24"
  },
  {
    id: 2,
    title: "We Rewrite the Light",
    creator: "Angela Fraser",
    linkedinUrl: "https://www.linkedin.com/in/angela-fraser",
    description: "AI Video, Fashion & Digital Storytelling interpretation",
    videoUrl: "/AngelaFraser.mp4",
    thumbnailUrl: "/thumbnails/angela-fraser.jpg",
    duration: "4:12"
  },
  {
    id: 3,
    title: "We Rewrite the Light",
    creator: "Flame Rozario",
    linkedinUrl: "https://sg.linkedin.com/in/flamerozario",
    description: "A dynamic visual story from Singapore's top digital marketing creator",
    videoUrl: "/FlameRozario.mp4",
    thumbnailUrl: "/thumbnails/flame-rozario.jpg",
    duration: "3:56"
  },
  {
    id: 4,
    title: "We Rewrite the Light",
    creator: "Mike Parker",
    linkedinUrl: "https://www.linkedin.com/in/mikeparkerjr",
    description: "An innovative take on the SHE IS AI message",
    videoUrl: "/MikeParker.mp4",
    thumbnailUrl: "/thumbnails/mike-parker.jpg",
    duration: "3:18"
  },
  {
    id: 5,
    title: "We Rewrite the Light",
    creator: "Mohammad Dadmand",
    linkedinUrl: "https://www.linkedin.com/in/mohamaddadmand",
    description: "Creative Director & AI Design Specialist's interpretation",
    videoUrl: "/MohamadDadmand.mp4",
    thumbnailUrl: "/thumbnails/mohammad-dadmand.jpg",
    duration: "4:05"
  },
  {
    id: 6,
    title: "We Rewrite the Light",
    creator: "Ngawai Lule",
    linkedinUrl: "https://nz.linkedin.com/in/ngawai-little-6a0856128",
    description: "A beautiful cultural perspective from New Zealand",
    videoUrl: "/NagawaLule.mp4",
    thumbnailUrl: "/thumbnails/ngawai-lule.jpg",
    duration: "3:42"
  },
  {
    id: 7,
    title: "We Rewrite the Light",
    creator: "Phillip Schein",
    linkedinUrl: "https://www.linkedin.com/in/phillipschein",
    description: "A cinematic approach with stunning album cover visuals",
    videoUrl: "/PhillipSchein.mov",
    thumbnailUrl: "/thumbnails/phillip-schein.jpg",
    duration: "3:28"
  },
  {
    id: 8,
    title: "We Rewrite the Light",
    creator: "Rachel Lavern",
    linkedinUrl: "https://www.linkedin.com/in/rachellavern",
    description: "Business optimization expert's empowering visual narrative",
    videoUrl: "/RachelLavern.mp4",
    thumbnailUrl: "/thumbnails/rachel-lavern.jpg",
    duration: "3:15"
  },
  {
    id: 9,
    title: "We Rewrite the Light",
    creator: "Rubbia Hussain",
    linkedinUrl: "https://www.linkedin.com/posts/rubbia-hussain-3b36bb232_womenintech-techinnovation-aileadership-activity-7358504929449119744-XyuR",
    description: "AI content innovator's vibrant celebration of diversity in AI",
    videoUrl: "/RubbiaHussain.mp4",
    thumbnailUrl: "/thumbnails/rubbia-hussain.jpg",
    duration: "2:52"
  },
  {
    id: 10,
    title: "We Rewrite the Light",
    creator: "Sarah Forsythe",
    linkedinUrl: "https://www.linkedin.com/in/sarah-forsythe-207a978a",
    description: "Sustainable fashion professional's inspiring interpretation",
    videoUrl: "/SarahForsythe.mov",
    thumbnailUrl: "/thumbnails/sarah-forsythe.jpg",
    duration: "3:33"
  },
  {
    id: 11,
    title: "SHE IS AI - Credits & Vision",
    creator: "Tanushri Roy",
    linkedinUrl: "https://in.linkedin.com/in/tanushri-roy-32a8bb54",
    description: "Policy consultant's compelling visual story of the SHE IS AI mission",
    videoUrl: "/Logos-credits-TanushriUpdated.mp4",
    thumbnailUrl: "/thumbnails/tanushri-roy.jpg",
    duration: "3:21"
  }
];

function App() {
  const [votes, setVotes] = useState({});
  const [hasVoted, setHasVoted] = useState(false);
  const [showSocialGate, setShowSocialGate] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [socialFollowed, setSocialFollowed] = useState({
    instagram: false,
    linkedin: false,
    twitter: false
  });
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  // Load initial data from backend
  useEffect(() => {
    loadVotingData();
    checkIfVoted();
  }, []);

  const loadVotingData = async () => {
    try {
      const response = await fetch(`${API_BASE}/votes`);
      const data = await response.json();
      
      if (data.success) {
        setVotes(data.votes);
      }
    } catch (error) {
      console.error('Error loading voting data:', error);
      // Fallback to initial data
      const initialVotes = {};
      videoSubmissions.forEach(video => {
        initialVotes[video.id] = video.votes || 0;
      });
      setVotes(initialVotes);
    }
  };

  const checkIfVoted = async () => {
    try {
      const response = await fetch(`${API_BASE}/check-voted`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setHasVoted(data.has_voted);
      }
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE}/analytics`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  // Countdown timer - 14 days from now ending at midnight
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 14);
      targetDate.setHours(23, 59, 59, 999);
      
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVote = async (videoId) => {
    if (hasVoted) {
      alert("You have already voted! Only one vote per person is allowed.");
      return;
    }

    // Check if social requirements are met
    const allFollowed = Object.values(socialFollowed).every(followed => followed);
    if (!allFollowed) {
      setSelectedVideo(videoId);
      setShowSocialGate(true);
      return;
    }

    await submitVote(videoId);
  };

  const submitVote = async (videoId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_id: videoId,
          social_follows: socialFollowed
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setVotes(prev => ({
          ...prev,
          [videoId]: data.new_vote_count
        }));
        setHasVoted(true);
        setShowSocialGate(false);
        setSelectedVideo(null);
        
        // Show success message
        alert('Vote submitted successfully! Thank you for participating.');
      } else {
        alert(data.error || 'Failed to submit vote');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialFollow = async (platform) => {
    // Simulate social media follow verification
    // In production, this would integrate with actual social media APIs
    
    setSocialFollowed(prev => ({
      ...prev,
      [platform]: true
    }));

    // Optional: Verify with backend
    try {
      await fetch(`${API_BASE}/social-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platforms: { ...socialFollowed, [platform]: true }
        })
      });
    } catch (error) {
      console.error('Error verifying social follow:', error);
    }
  };

  const proceedWithVote = async () => {
    const allFollowed = Object.values(socialFollowed).every(followed => followed);
    if (allFollowed && selectedVideo) {
      await submitVote(selectedVideo);
    }
  };

  const shareVideo = (video) => {
    const shareText = `Check out "${video.title}" by ${video.creator} in the SHE IS AI "We Rewrite the Light" video competition! Vote now: ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Share link copied to clipboard!');
    }
  };

  const openVideo = (video) => {
    setCurrentVideo(video);
    setShowVideoModal(true);
  };

  const openSocialMedia = (platform) => {
    const urls = {
      instagram: 'https://instagram.com/sheisai.ai',
      linkedin: 'https://linkedin.com/company/sheisai',
      twitter: 'https://twitter.com/sheisai',
      facebook: 'https://facebook.com/sheisai'
    };
    
    window.open(urls[platform], '_blank');
  };

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              <a href="https://sheisai.ai/" className="flex items-center">
                <img src="./assets/sheisai-logo.png" alt="SHE IS AI" className="h-6 w-auto" />
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="https://sheisai.ai/ai-fashion-awards" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors font-normal text-xs uppercase tracking-wide">
                AI FASHION AWARDS
              </a>
              <a href="https://sheisai.ai/magazine" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors font-normal text-xs uppercase tracking-wide">
                MAGAZINE
              </a>
              <a href="https://sheisai.ai/she-is-ai-community" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors font-normal text-xs uppercase tracking-wide">
                5 PILLARS
              </a>
              <a href="https://sheisai.ai/xpert-agency" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors font-normal text-xs uppercase tracking-wide">
                AGENCY
              </a>
              <a href="https://sheisai.ai/metaverse-gallery" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors font-normal text-xs uppercase tracking-wide">
                METAVERSE
              </a>
              <a href="https://sheisai.ai/she-is-ai-news" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors font-normal text-xs uppercase tracking-wide">
                NEWS
              </a>
              <a href="https://sheisai.ai/about" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors font-normal text-xs uppercase tracking-wide">
                ABOUT
              </a>
              <a href="https://sheisai.ai/contact" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors font-normal text-xs uppercase tracking-wide">
                CONTACT
              </a>
            </div>
            <div className="flex items-center">
              <a href="https://sheisai.ai/become-a-member" target="_blank" rel="noopener noreferrer">
                <button className="border border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-black transition-colors px-4 py-1.5 rounded font-normal text-xs uppercase tracking-wide">
                  BECOME A MEMBER
                </button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="sheisai-hero-bg min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >

            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              Vote for your favorite video in the SHE IS AI theme song competition. 
              Community voting to select the winner.
            </p>
            
            {/* Countdown Timer */}
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold countdown-number">{timeRemaining.days}</div>
                <div className="text-sm text-gray-400">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold countdown-number">{timeRemaining.hours}</div>
                <div className="text-sm text-gray-400">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold countdown-number">{timeRemaining.minutes}</div>
                <div className="text-sm text-gray-400">MINUTES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold countdown-number">{timeRemaining.seconds}</div>
                <div className="text-sm text-gray-400">SECONDS</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="vote-button text-lg px-8 py-4"
                onClick={() => document.getElementById('video-gallery').scrollIntoView({ behavior: 'smooth' })}
              >
                <Vote className="w-5 h-5 mr-2" />
                START VOTING
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={loadAnalytics}
              >
                <Trophy className="w-5 h-5 mr-2" />
                VIEW LEADERBOARD
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold golden-accent">{totalVotes}</div>
              <div className="text-gray-400">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold golden-accent">11</div>
              <div className="text-gray-400">Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold golden-accent">0</div>
              <div className="text-gray-400">Participants</div>
            </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section id="video-gallery" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Featured Original Video */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-6">
              <span className="text-white">FEATURED</span>
              <span className="golden-accent"> ORIGINAL</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              The original SHE IS AI theme song that inspired this competition.
            </p>
            
            <div className="max-w-2xl mx-auto mb-16">
              <Card className="video-card overflow-hidden border-2 border-golden-accent">
                <div className="relative">
                  <img 
                    src={featuredVideo.thumbnailUrl} 
                    alt={featuredVideo.title}
                    className="w-full h-64 object-cover"
                  />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button 
                        size="lg" 
                        className="rounded-full golden-glow"
                        onClick={() => openVideo(featuredVideo)}
                      >
                        <Play className="w-8 h-8" />
                      </Button>
                    </div>
                  <Badge className="absolute top-2 right-2 bg-black/70">
                    {featuredVideo.duration}
                  </Badge>
                  <Badge className="absolute top-2 left-2 bg-golden-accent text-black font-bold">
                    ORIGINAL
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl golden-accent">{featuredVideo.title}</CardTitle>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-gray-400">by</span>
                    <a 
                      href={featuredVideo.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-golden-accent hover:underline flex items-center font-semibold"
                    >
                      {featuredVideo.creator}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-300 text-center">{featuredVideo.description}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Competition Submissions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-6">
              <span className="text-white">COMPETITION</span>
              <span className="golden-accent"> SUBMISSIONS</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Vote for your favorite interpretation of "We Rewrite the Light" by talented creators from around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoSubmissions.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="video-card overflow-hidden">
                  <div className="relative">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button 
                        size="lg" 
                        className="rounded-full"
                        onClick={() => openVideo(video)}
                      >
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70">
                      {video.duration}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">by</span>
                      <a 
                        href={video.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline flex items-center"
                      >
                        {video.creator}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-4">{video.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{votes[video.id] || 0} votes</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {totalVotes > 0 ? ((votes[video.id] || 0) / totalVotes * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        className="w-full vote-button"
                        onClick={() => handleVote(video.id)}
                        disabled={hasVoted || loading}
                      >
                        <Vote className="w-4 h-4 mr-2" />
                        {loading ? 'VOTING...' : hasVoted ? 'VOTED' : 'VOTE NOW'}
                      </Button>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => shareVideo(video)}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openSocialMedia('instagram')}
                        >
                          <Instagram className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openSocialMedia('twitter')}
                        >
                          <Twitter className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openSocialMedia('facebook')}
                        >
                          <Facebook className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Gate Modal */}
      <Dialog open={showSocialGate} onOpenChange={setShowSocialGate}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Follow SHE IS AI to Vote
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-gray-300">
              To participate in voting, please follow SHE IS AI on social media:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <span>Follow on Instagram</span>
                </div>
                <Button 
                  size="sm" 
                  variant={socialFollowed.instagram ? "secondary" : "default"}
                  onClick={() => {
                    openSocialMedia('instagram');
                    handleSocialFollow('instagram');
                  }}
                >
                  {socialFollowed.instagram ? 'Followed' : 'Follow'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-5 h-5 text-blue-500" />
                  <span>Follow on LinkedIn</span>
                </div>
                <Button 
                  size="sm" 
                  variant={socialFollowed.linkedin ? "secondary" : "default"}
                  onClick={() => {
                    openSocialMedia('linkedin');
                    handleSocialFollow('linkedin');
                  }}
                >
                  {socialFollowed.linkedin ? 'Followed' : 'Follow'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <span>Follow on Twitter</span>
                </div>
                <Button 
                  size="sm" 
                  variant={socialFollowed.twitter ? "secondary" : "default"}
                  onClick={() => {
                    openSocialMedia('twitter');
                    handleSocialFollow('twitter');
                  }}
                >
                  {socialFollowed.twitter ? 'Followed' : 'Follow'}
                </Button>
              </div>
            </div>
            
            <Button 
              className="w-full vote-button mt-6"
              onClick={proceedWithVote}
              disabled={!Object.values(socialFollowed).every(followed => followed) || loading}
            >
              {loading ? 'Submitting Vote...' : 'Complete Vote'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* About SHE IS AI Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title mb-8">
              <span className="text-white">ABOUT</span>
              <span className="sheisai-text-gradient"> SHE IS AI</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              SHE IS AI is a groundbreaking global ecosystem dedicated to empowering women, 
              youth and rising talent at the forefront of artificial intelligence, technology, 
              and innovation. We create ethical pathways, visibility, and opportunities for 
              women to gain authority, collaborate, and lead across AI industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="social-button"
                onClick={() => window.open('https://sheisai.ai', '_blank')}
              >
                Learn More About SHE IS AI
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('https://sheisai.ai/community', '_blank')}
              >
                Join Our Community
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-white">SHE IS</span>
                <span className="sheisai-text-gradient">ai</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering women in AI through community, education, and opportunity.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://sheisai.ai/" target="_blank" className="hover:text-white">Home</a></li>
                <li><a href="https://sheisai.ai/about" target="_blank" className="hover:text-white">About</a></li>
                <li><a href="https://sheisai.ai/contact" target="_blank" className="hover:text-white">Contact</a></li>
                <li><a href="https://sheisai.ai/team" target="_blank" className="hover:text-white">Team</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">SHE IS AI</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://sheisai.ai/magazine" target="_blank" className="hover:text-white">Read Magazine</a></li>
                <li><a href="https://sheisai.ai/magazine-submissions" target="_blank" className="hover:text-white">Mag Submissions</a></li>
                <li><a href="https://sheisai.ai/she-is-ai-community" target="_blank" className="hover:text-white">Join Community</a></li>
                <li><a href="https://sheisai.ai/ai-fashion-awards" target="_blank" className="hover:text-white">AI Fashion Awards</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openSocialMedia('instagram')}
                >
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openSocialMedia('linkedin')}
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openSocialMedia('twitter')}
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openSocialMedia('facebook')}
                >
                  <Facebook className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 | SHE IS AI ™ | All rights reserved | 
              <a href="https://sheisai.ai/privacy-policy" target="_blank" className="hover:text-white ml-2">Privacy Policy</a> | 
              <a href="https://sheisai.ai/terms-of-use" target="_blank" className="hover:text-white ml-2">Terms of Use</a>
            </p>
            <p className="mt-2">Website Design & AI Art | <a href="https://sheisai.ai/rachel-gaia" target="_blank" className="hover:text-white">Rachel Gaia</a></p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="bg-black border-border max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="text-center text-xl golden-accent">
              {currentVideo?.title}
            </DialogTitle>
            <div className="text-center text-gray-400">
              by <a 
                href={currentVideo?.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-golden-accent hover:underline"
              >
                {currentVideo?.creator}
              </a>
            </div>
          </DialogHeader>
          
          {currentVideo && (
            <div className="aspect-video w-full">
              <video 
                controls 
                className="w-full h-full rounded-lg"
                poster={currentVideo.thumbnailUrl}
              >
                <source src={currentVideo.videoUrl} type="video/mp4" />
                <source src={currentVideo.videoUrl} type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          <div className="text-center text-gray-300 mt-4">
            {currentVideo?.description}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App

