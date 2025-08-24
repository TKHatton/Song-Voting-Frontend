import React, { useState, useEffect } from 'react';
import './App.css';

// Add this after your imports, before the App function
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://song-voting-backend.onrender.com';

function App() {
  const [timeLeft, setTimeLeft] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [votes, setVotes] = useState({});
  const [hasVoted, setHasVoted] = useState(false);
  const [socialFollows, setSocialFollows] = useState({
    instagram: false,
    linkedin: false,
    twitter: false
  });
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [videoModal, setVideoModal] = useState({ isOpen: false, video: null });

// Load votes from backend on component mount
useEffect(() => {
  const loadVotes = async () => {
    try {
      const response = await fetch(`${API_BASE}/votes`);
      const data = await response.json();
      
      if (data.success) {
        setVotes(data.votes);
      }
    } catch (error) {
      console.error('Error loading votes:', error);
      // Keep existing local vote counts if API fails
    }
  };

  loadVotes();
}, []);

  // Calculate countdown timer (14 days from now)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endDate = new Date(now + (14 * 24 * 60 * 60 * 1000)).getTime(); // 14 days from now
      const difference = endDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Featured video (original)
  const featuredVideo = {
    id: 'featured',
    title: 'We Rewrite the Light - Original Theme Song',
    creator: 'Lenise Kenney',
    duration: '3:45',
    description: 'The original SHE IS AI theme song that inspired this competition',
    thumbnail: '/thumbnails/lenise-kenney.jpg',
    videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with actual embed
    linkedinUrl: 'https://www.linkedin.com/in/lenise-kenney'
  };

  // Competition video submissions (ready for embeds)
  const videoSubmissions = [
    {
      id: 1,
      title: 'Creative Interpretation',
      creator: 'Alice Kranaviter',
      duration: '3:24',
      description: 'A creative interpretation of the SHE IS AI theme song',
      thumbnail: '/thumbnails/alice-kranaviter.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with actual embed
      linkedinUrl: 'https://it.linkedin.com/in/alice-kranaviter-7390b946',
      votes: votes[1] || 0
    },
    {
      id: 2,
      title: 'AI Video & Digital Storytelling',
      creator: 'Angela Fraser',
      duration: '4:12',
      description: 'AI Video, Fashion & Digital Storytelling interpretation',
      thumbnail: '/thumbnails/angela-fraser.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with actual embed
      linkedinUrl: 'https://www.linkedin.com/in/angela-fraser',
      votes: votes[2] || 0
    },
    {
      id: 3,
      title: 'Dynamic Visual Story',
      creator: 'Flame Rozario',
      duration: '3:56',
      description: 'A dynamic visual story from Singapore\'s top digital marketing creator',
      thumbnail: '/thumbnails/flame-rozario.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with actual embed
      linkedinUrl: 'https://sg.linkedin.com/in/flamerozario',
      votes: votes[3] || 0
    },
    {
      id: 4,
      title: 'Innovative Take',
      creator: 'Mike Parker',
      duration: '3:18',
      description: 'An innovative take on the SHE IS AI message',
      thumbnail: '/thumbnails/mike-parker.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with actual embed
      linkedinUrl: 'https://www.linkedin.com/in/mikeparkerjr',
      votes: votes[4] || 0
    },
    {
      id: 5,
      title: 'Creative Director\'s Vision',
      creator: 'Mohammad Dadmand',
      duration: '4:05',
      description: 'Creative Director & AI Design Specialist\'s interpretation',
      thumbnail: '/thumbnails/mohammad-dadmand.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with actual embed
      linkedinUrl: 'https://www.linkedin.com/in/mohamaddadmand',
      votes: votes[5] || 0
    },
    {
      id: 6,
      title: 'Cultural Perspective',
      creator: 'Ngawai Lule',
      duration: '3:42',
      description: 'A beautiful cultural perspective from New Zealand',
      thumbnail: '/thumbnails/ngawai-lule.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with actual embed
      linkedinUrl: 'https://nz.linkedin.com/in/ngawai-little-6a0856128',
      votes: votes[6] || 0
    },
    {
      id: 7,
      title: 'Cinematic Approach',
      creator: 'Phillip Schein',
      duration: '3:28',
      description: 'A cinematic approach with stunning album cover visuals',
      thumbnail: '/thumbnails/phillip-schein.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with actual embed
      linkedinUrl: 'https://www.linkedin.com/in/phillipschein',
      votes: votes[7] || 0
    },
    {
      id: 8,
      title: 'Empowering Narrative',
      creator: 'Rachel Lavern',
      duration: '3:15',
      description: 'Business optimization expert\'s empowering visual narrative',
      thumbnail: '/thumbnails/rachel-lavern.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with actual embed
      linkedinUrl: 'https://www.linkedin.com/in/rachellavern',
      votes: votes[8] || 0
    },
    {
      id: 9,
      title: 'Celebration of Diversity',
      creator: 'Rubbia Hussain',
      duration: '2:52',
      description: 'AI content innovator\'s vibrant celebration of diversity in AI',
      thumbnail: '/thumbnails/rubbia-hussain.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with actual embed
      linkedinUrl: 'https://www.linkedin.com/in/rubbia-hussain',
      votes: votes[9] || 0
    },
    {
      id: 10,
      title: 'Sustainable Vision',
      creator: 'Sarah Forsythe',
      duration: '3:33',
      description: 'Sustainable fashion professional\'s inspiring interpretation',
      thumbnail: '/thumbnails/sarah-forsythe.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with actual embed
      linkedinUrl: 'https://www.linkedin.com/in/sarah-forsythe-207a978a',
      votes: votes[10] || 0
    },
    {
      id: 11,
      title: 'SHE IS AI - Credits & Vision',
      creator: 'Tanushri Roy',
      duration: '3:21',
      description: 'Policy consultant\'s compelling visual story of the SHE IS AI mission',
      thumbnail: '/thumbnails/tanushri-roy.jpg',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID', // Replace with actual embed
      linkedinUrl: 'https://in.linkedin.com/in/tanushri-roy-32a8bb54',
      votes: votes[11] || 0
    }
  ];

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

  const openVideo = (video) => {
    setVideoModal({ isOpen: true, video });
  };

  const closeVideo = () => {
    setVideoModal({ isOpen: false, video: null });
  };

  const handleVote = (videoId) => {
    if (hasVoted) {
      alert('You have already voted!');
      return;
    }
    setSelectedVideo(videoId);
    setShowVotingModal(true);
  };

  const handleSocialFollow = (platform) => {
    setSocialFollows(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const submitVote = async () => {
  if (!socialFollows.instagram || !socialFollows.linkedin || !socialFollows.twitter) {
    alert('Please follow all social media accounts before voting!');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_id: selectedVideo,
        social_follows: socialFollows
      })
    });

    const data = await response.json();

    if (data.success) {
      setVotes(prev => ({
        ...prev,
        [selectedVideo]: data.new_vote_count
      }));
      setHasVoted(true);
      setShowVotingModal(false);
      alert('Thank you for voting!');
    } else {
      alert(data.error || 'Failed to submit vote');
    }
  } catch (error) {
    console.error('Error submitting vote:', error);
    alert('Failed to submit vote. Please try again.');
  }
};

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center">
              <a href="https://sheisai.ai" className="flex-shrink-0">
                <img 
                  src="/assets/sheisai-logo.png" 
                  alt="SHE IS AI" 
                  className="h-8 w-auto"
                />
              </a>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                <a href="https://sheisai.ai/ai-fashion-awards" className="text-white hover:text-golden-400 px-3 py-2 text-xs font-normal tracking-wide transition-colors">AI FASHION AWARDS</a>
                <a href="https://sheisai.ai/magazine" className="text-white hover:text-golden-400 px-3 py-2 text-xs font-normal tracking-wide transition-colors">MAGAZINE</a>
                <a href="https://sheisai.ai/she-is-ai-community" className="text-white hover:text-golden-400 px-3 py-2 text-xs font-normal tracking-wide transition-colors">5 PILLARS</a>
                <a href="https://sheisai.ai/xpert-agency" className="text-white hover:text-golden-400 px-3 py-2 text-xs font-normal tracking-wide transition-colors">AGENCY</a>
                <a href="https://sheisai.ai/metaverse-gallery" className="text-white hover:text-golden-400 px-3 py-2 text-xs font-normal tracking-wide transition-colors">METAVERSE</a>
                <a href="https://sheisai.ai/she-is-ai-news" className="text-white hover:text-golden-400 px-3 py-2 text-xs font-normal tracking-wide transition-colors">NEWS</a>
                <a href="https://sheisai.ai/about" className="text-white hover:text-golden-400 px-3 py-2 text-xs font-normal tracking-wide transition-colors">ABOUT</a>
                <a href="https://sheisai.ai/contact" className="text-white hover:text-golden-400 px-3 py-2 text-xs font-normal tracking-wide transition-colors">CONTACT</a>
              </div>
            </div>
            
            <div className="hidden md:block">
              <a href="https://sheisai.ai/become-a-member" className="border border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-black px-4 py-2 text-xs font-normal tracking-wide transition-colors">
                BECOME A MEMBER
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto">
            Vote for your favorite video in the SHE IS AI theme song competition. Community voting to select the winner.
          </p>
          
          {/* Countdown Timer */}
          <div className="mb-8">
            <div className="flex justify-center space-x-4 sm:space-x-8 mb-4">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-golden-400">{timeLeft.days || 0}</div>
                <div className="text-sm text-gray-300">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-golden-400">{timeLeft.hours || 0}</div>
                <div className="text-sm text-gray-300">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-golden-400">{timeLeft.minutes || 0}</div>
                <div className="text-sm text-gray-300">MINUTES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-golden-400">{timeLeft.seconds || 0}</div>
                <div className="text-sm text-gray-300">SECONDS</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('submissions').scrollIntoView({ behavior: 'smooth' })}
              className="vote-button bg-golden-400 hover:bg-golden-500 text-black px-8 py-3 font-semibold transition-all duration-300"
            >
              🗳️ START VOTING
            </button>
            <button 
              onClick={() => document.getElementById('leaderboard').scrollIntoView({ behavior: 'smooth' })}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-8 py-3 font-semibold transition-all duration-300"
            >
              🏆 VIEW LEADERBOARD
            </button>
          </div>

          {/* Statistics */}
          <div className="mt-12 flex justify-center space-x-8 sm:space-x-16">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-golden-400">{totalVotes}</div>
              <div className="text-sm text-gray-300">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-golden-400">{videoSubmissions.length}</div>
              <div className="text-sm text-gray-300">Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-golden-400">0</div>
              <div className="text-sm text-gray-300">Participants</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Original Video */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              FEATURED <span className="text-golden-400">ORIGINAL</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              The original SHE IS AI theme song by Lenise Kenney that inspired this amazing competition
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="video-card bg-gray-900 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={featuredVideo.thumbnail} 
                  alt={featuredVideo.title}
                  className="w-full h-64 sm:h-80 object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZlYXR1cmVkIFZpZGVvPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button 
                    onClick={() => openVideo(featuredVideo)}
                    className="play-button bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-all duration-300"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l8-5-8-5z"/>
                    </svg>
                  </button>
                </div>
                <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 text-sm font-semibold">
                  ORIGINAL
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 text-sm">
                  {featuredVideo.duration}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{featuredVideo.title}</h3>
                <p className="text-golden-400 mb-2">
                  by <a href={featuredVideo.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{featuredVideo.creator}</a>
                </p>
                <p className="text-gray-300">{featuredVideo.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Submissions */}
      <section id="submissions" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              COMPETITION <span className="text-golden-400">SUBMISSIONS</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Vote for your favorite interpretation of "We Rewrite the Light" by talented creators from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoSubmissions.map((video) => (
              <div key={video.id} className="video-card bg-black rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => openVideo(video)}
                      className="play-button bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l8-5-8-5z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">{video.title}</h3>
                  <p className="text-golden-400 text-sm mb-2">
                    by <a href={video.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{video.creator}</a>
                  </p>
                  <p className="text-gray-300 text-sm mb-4">{video.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-golden-400 font-semibold">{video.votes} votes</span>
                  </div>
                  
                  <button 
                    onClick={() => handleVote(video.id)}
                    disabled={hasVoted}
                    className={`w-full py-2 px-4 font-semibold transition-all duration-300 ${
                      hasVoted 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'vote-button bg-golden-400 hover:bg-golden-500 text-black'
                    }`}
                  >
                    {hasVoted ? 'VOTED' : 'VOTE NOW'}
                  </button>
                  
                  <div className="flex justify-center space-x-2 mt-3">
                    <button className="social-share-btn bg-blue-600 hover:bg-blue-700 text-white p-2 text-xs transition-colors">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">About <span className="text-golden-400">SHE IS AI</span></h2>
          <p className="text-lg text-gray-300 mb-8">
            SHE IS AI is a global community empowering women in artificial intelligence through education, 
            networking, and opportunity creation. Join us in rewriting the future of AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://sheisai.ai" className="bg-golden-400 hover:bg-golden-500 text-black px-8 py-3 font-semibold transition-all duration-300">
              Learn More About SHE IS AI
            </a>
            <a href="https://sheisai.ai/she-is-ai-community" className="bg-transparent border-2 border-golden-400 hover:bg-golden-400 hover:text-black text-golden-400 px-8 py-3 font-semibold transition-all duration-300">
              Join Our Community
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-golden-400">SHE ISai</h3>
              <p className="text-gray-300 text-sm">
                Empowering women in AI through community, education, and opportunity.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-golden-400">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://sheisai.ai" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="https://sheisai.ai/about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
                <li><a href="https://sheisai.ai/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-golden-400">SHE IS AI</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://sheisai.ai/magazine" className="text-gray-300 hover:text-white transition-colors">Read Magazine</a></li>
                <li><a href="https://sheisai.ai/she-is-ai-community" className="text-gray-300 hover:text-white transition-colors">Join Community</a></li>
                <li><a href="https://sheisai.ai/ai-fashion-awards" className="text-gray-300 hover:text-white transition-colors">AI Fashion Awards</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-golden-400">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://instagram.com/sheisai" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                <a href="https://linkedin.com/company/sheisai" className="text-gray-300 hover:text-white transition-colors">LinkedIn</a>
                <a href="https://twitter.com/sheisai" className="text-gray-300 hover:text-white transition-colors">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-300 text-sm">
              © 2025 | SHE IS AI ™ | All rights reserved | 
              <a href="https://sheisai.ai/privacy" className="hover:text-white transition-colors"> Privacy Policy</a> | 
              <a href="https://sheisai.ai/terms" className="hover:text-white transition-colors"> Terms of Use</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Voting Modal */}
      {showVotingModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Complete Your Vote</h3>
            <p className="text-gray-300 mb-6">Follow our social media accounts to unlock voting:</p>
            
            <div className="space-y-4 mb-6">
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={socialFollows.instagram}
                  onChange={() => handleSocialFollow('instagram')}
                  className="form-checkbox"
                />
                <span>Follow on Instagram</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={socialFollows.linkedin}
                  onChange={() => handleSocialFollow('linkedin')}
                  className="form-checkbox"
                />
                <span>Follow on LinkedIn</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={socialFollows.twitter}
                  onChange={() => handleSocialFollow('twitter')}
                  className="form-checkbox"
                />
                <span>Follow on Twitter</span>
              </label>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={submitVote}
                className="flex-1 bg-golden-400 hover:bg-golden-500 text-black py-2 px-4 font-semibold transition-colors"
              >
                Complete Vote
              </button>
              <button 
                onClick={() => setShowVotingModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModal.isOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h3 className="text-xl font-bold">{videoModal.video?.title}</h3>
              <button 
                onClick={closeVideo}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="aspect-video">
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl mb-4">Video Coming Soon</p>
                  <p className="text-gray-400">This video will be embedded once uploaded</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

