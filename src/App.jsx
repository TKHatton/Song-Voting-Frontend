// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8888/.netlify/functions'
    : '/.netlify/functions';

function App() {
  const [timeLeft, setTimeLeft] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [votes, setVotes] = useState({});
  const [hasVoted, setHasVoted] = useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [videoModal, setVideoModal] = useState({ isOpen: false, video: null });
  const [imageModal, setImageModal] = useState({ isOpen: false, image: null });
  const [currentPage, setCurrentPage] = useState('home');
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState(null);
  const [navOpen, setNavOpen] = useState(false);


// Load totals from server on first render
useEffect(() => {
  let alive = true;
  (async () => {
    try {
      const res = await fetch(`${API_BASE}/votes`, { cache: 'no-store' });
      const data = await res.json();
      if (alive && data?.success) {
        setVotes(data.votes || {});
      }
    } catch (err) {
      console.error('Error loading votes:', err);
      // optional: keep existing counts / show a toast
    }
  })();

  return () => { alive = false; };
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

  // Featured video (explainer)
const featuredVideo = {
  id: 'HOW IT WORKS',
  title: 'Voting Rules & How to Participate',
  duration: '0:27',
  description: 'This essential guide covers everything you need to know: the 14-day timeline, daily voting rules, and how to make your voice count. Vote today and come back tomorrow to vote again!',
  thumbnail: '/thumbnails/main-video.jpeg',
  videoUrl: 'https://www.youtube.com/embed/Rb-VCiM7lSY'
};

  // Competition video submissions (organized alphabetically by last name)
  const videoSubmissions = [
    {
      id: 1,
      title: 'Inspiring Visual Style',
      creator: 'Hellena Banner',
      duration: '1:53',
      description: 'Creative professional\'s inspiring style showcase - alternative work sample as original entry was lost',
      thumbnail: '/thumbnails/hellena-banner2.png',
      videoUrl: 'https://www.youtube.com/embed/SPvte1f4zc8',
      linkedinUrl: 'https://www.linkedin.com/in/hellena-b-254ab0302', // Update with actual LinkedIn
      votes: votes[1] || 0,
      isAlternative: true
    },
    {
      id: 2,
      title: 'Creative Director\'s Vision',
      creator: 'Mohammad Dadmand',
      duration: '0:41',
      description: 'Creative Director & AI Design Specialist\'s interpretation',
      thumbnail: '/thumbnails/mohammad-dadmand.jpg',
      videoUrl: 'https://www.youtube.com/embed/sW1tyvlqj8Q',
      linkedinUrl: 'https://www.linkedin.com/in/mohamaddadmand',
      votes: votes[2] || 0
    },
    {
      id: 3,
      title: 'Dynamic Creative Expression',
      creator: 'Barbara Estebaranz',
      duration: '0:59',
      description: 'Creative professional\'s dynamic interpretation of the SHE IS AI theme',
      thumbnail: '/thumbnails/barbara-estebaranz.png',
      videoUrl: 'https://www.youtube.com/embed/XCyFLdvlyUg',
      linkedinUrl: 'https://www.linkedin.com/in/barbtechcreative', // Update with actual LinkedIn
      votes: votes[3] || 0
    },
    {
      id: 4,
      title: 'Sustainable Fashion Vision',
      creator: 'Sarah Forsythe',
      duration: '3:32',
      description: 'Sustainable fashion professional\'s inspiring interpretation',
      thumbnail: '/thumbnails/sarah-forsythe.jpg',
      videoUrl: 'https://www.youtube.com/embed/m1v0-qjQSWU',
      linkedinUrl: 'https://www.linkedin.com/in/sarahcatherinejewelry',
      votes: votes[4] || 0
    },
    {
      id: 5,
      title: 'AI Video & Digital Storytelling',
      creator: 'Angela Fraser',
      duration: '3:38',
      description: 'AI Video, Fashion & Digital Storytelling interpretation',
      thumbnail: '/thumbnails/angela-fraser.jpg',
      videoUrl: 'https://www.youtube.com/embed/Q0Ow-m7P_pA',
      linkedinUrl: 'https://www.linkedin.com/in/angela-fraser',
      votes: votes[5] || 0
    },
    {
      id: 6,
      title: 'Celebration of Diversity',
      creator: 'Rubbia Hussain',
      duration: '1:17',
      description: 'AI content innovator\'s vibrant celebration of diversity in AI',
      thumbnail: '/thumbnails/rubbia-hussain.jpg',
      videoUrl: 'https://www.youtube.com/embed/58q5ObMsamM',
      linkedinUrl: 'https://www.linkedin.com/in/rubbia-h-3b36bb232',
      votes: votes[6] || 0
    },
    {
      id: 7,
      title: 'AI-Powered Visual Artistry',
      creator: 'May Kaneko',
      duration: null,
      description: 'Stunning visual interpretation of the SHE IS AI theme through digital artistry',
      thumbnail: '/thumbnails/may-kaneko.jpg',
      imageUrl: '/images/may-kaneko-submission.jpg',
      linkedinUrl: 'https://www.linkedin.com/in/maykaneko', // Update with actual LinkedIn
      votes: votes[7] || 0,
      isImage: true
    },
    {
      id: 8,
      title: 'Creative Interpretation',
      creator: 'Alice Kranaviter',
      duration: '0:16',
      description: 'A creative interpretation of the SHE IS AI theme song',
      thumbnail: '/thumbnails/alice-kranaviter.jpg',
      videoUrl: 'https://www.youtube.com/embed/Og014KfobTs',
      linkedinUrl: 'https://it.linkedin.com/in/alice-kranaviter-7390b946',
      votes: votes[8] || 0
    },
    {
      id: 9,
      title: 'Empowering Narrative',
      creator: 'Rachel Lavern',
      duration: '3:36',
      description: 'Business optimization expert\'s empowering visual narrative',
      thumbnail: '/thumbnails/rachel-lavern.jpg',
      videoUrl: 'https://www.youtube.com/embed/f0GBaDV9PLo',
      linkedinUrl: 'https://www.linkedin.com/in/rachellavern',
      votes: votes[9] || 0
    },
    {
      id: 10,
      title: 'Innovative Creative Vision',
      creator: 'Julia Lewis',
      duration: '0:54',
      description: 'Innovative creative professional\'s unique take on the SHE IS AI message',
      thumbnail: '/thumbnails/julia-lewis.png',
      videoUrl: 'https://www.youtube.com/embed/sqIBbhjPf0E',
      linkedinUrl: 'https://www.linkedin.com/in/julia-lewis-genai/', // Update with actual LinkedIn
      votes: votes[10] || 0
    },
    {
      id: 11,
      title: 'Cross Cultural Perspective',
      creator: 'Nagawa Lule',
      duration: '0:46',
      description: 'A creative global perspective from London showcasing cultures & customs across continents',
      thumbnail: '/thumbnails/ngawai-lule.jpg',
      videoUrl: 'https://www.youtube.com/embed/Oa-r4GSRSCQ',
      linkedinUrl: 'https://www.linkedin.com/in/nagawa-l/',
      votes: votes[11] || 0
    },
    {
      id: 12,
      title: 'Innovative Take',
      creator: 'Mike Parker',
      duration: '1:31',
      description: 'An innovative take on the SHE IS AI message',
      thumbnail: '/thumbnails/mike-parker.jpg',
      videoUrl: 'https://www.youtube.com/embed/EWDPc9VVSUo',
      linkedinUrl: 'https://www.linkedin.com/in/mikeparkerai',
      votes: votes[12] || 0
    },
    {
      id: 13,
      title: 'Dynamic Visual Story',
      creator: 'Flame Rozario',
      duration: '0:32',
      description: 'A dynamic visual story from Singapore\'s top digital marketing creator',
      thumbnail: '/thumbnails/flame-rozario.jpg',
      videoUrl: 'https://www.youtube.com/embed/6R6wQDlu510',
      linkedinUrl: 'https://sg.linkedin.com/in/flamerozario',
      votes: votes[13] || 0
    },
    {
      id: 14,
      title: 'SHE IS AI - Credits & Vision',
      creator: 'Tanushri Roy',
      duration: '2:25',
      description: 'Policy consultant\'s compelling visual story of the SHE IS AI mission',
      thumbnail: '/thumbnails/tanushri-roy.jpg',
      videoUrl: 'https://www.youtube.com/embed/iW9kYaEzH_8',
      linkedinUrl: 'https://in.linkedin.com/in/tanushriroy',
      votes: votes[14] || 0
    },
    {
      id: 15,
      title: 'Cinematic Video Approach',
      creator: 'Phillip Schein',
      duration: '1:43',
      description: 'A cinematic video approach with stunning visual storytelling',
      thumbnail: '/thumbnails/phillip-schein.jpg',
      videoUrl: 'https://www.youtube.com/embed/4vZEPgxipsE',
      linkedinUrl: 'https://www.linkedin.com/in/phillipschein',
      votes: votes[15] || 0
    },
    {
      id: 16,
      title: 'Album Cover Artistry',
      creator: 'Phillip Schein',
      duration: null,
      description: 'Stunning album cover design showcasing futuristic AI-powered artistry',
      thumbnail: '/thumbnails/phillip-schein-art.png',
      imageUrl: '/images/phillip-schein-album-cover.png',
      linkedinUrl: 'https://www.linkedin.com/in/phillipschein',
      votes: votes[16] || 0,
      isImage: true
    },
    {
      id: 17,
      title: 'Professional Creative Expression',
      creator: 'Stacy Scibetta',
      duration: '1:07',
      description: 'Professional creative\'s expressive interpretation of the SHE IS AI theme',
      thumbnail: '/thumbnails/stacy-scibetta.png',
      videoUrl: 'https://www.youtube.com/embed/94ZOoRGM-Nw',
      linkedinUrl: 'https://www.linkedin.com/in/stacyscibetta', // Update with actual LinkedIn
      votes: votes[17] || 0
    }
  ];

  // Enhanced rendering function to properly handle images vs videos
  const renderSubmissionCard = (submission) => (
    <div key={submission.id} className="video-card">
      <div className="relative">
        <img 
          src={submission.thumbnail} 
          alt={submission.title}
          className="video-thumbnail"
          loading="lazy"
          onError={(e) => {
            e.target.src = 
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button 
            onClick={() => submission.isImage ? openImage(submission) : openVideo(submission)}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors"
          >
            {submission.isImage ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
            )}
          </button>
        </div>
        {/* Only show duration for videos, not images */}
        {submission.duration && !submission.isImage && (
          <div className="absolute bottom-4 right-4">
            <span className="bg-black/70 text-white px-2 py-1 text-sm rounded">{submission.duration}</span>
          </div>
        )}
        {/* Show IMAGE badge for image submissions */}
        {submission.isImage && (
          <div className="absolute top-4 left-4">
            <span className="bg-purple-600 text-white px-2 py-1 text-sm font-semibold rounded">ARTWORK</span>
          </div>
        )}
        {/* Show STYLE SAMPLE badge for alternative content */}
        {submission.isAlternative && (
          <div className="absolute top-4 left-4">
            <span className="bg-orange-600 text-white px-2 py-1 text-sm font-semibold rounded">STYLE SAMPLE</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{submission.title}</h3>
        <p className="text-gray-300 mb-2">
          by <a href={submission.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">{submission.creator}</a>
        </p>
        <p className="text-gray-400 text-sm mb-4">{submission.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-yellow-400 font-semibold">{submission.votes} votes</span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => handleVote(submission.id)}
            className="flex-1 vote-button"
            disabled={hasVoted  || isVoting}
          >
            {isVoting ? 'VOTING...' : 'VOTE NOW'}
          </button>
          <button 
            onClick={() => handleShare(submission)}
            className="share-button"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

  const openVideo = (video) => {
    setVideoModal({ isOpen: true, video });
  };

  const closeVideo = () => {
    setVideoModal({ isOpen: false, video: null });
  };

  const openImage = (submission) => {
  setImageModal({ isOpen: true, image: submission });
  };

  const closeImage = () => {
  setImageModal({ isOpen: false, image: null });
  };

  // Allow vote attempts - let backend handle the 24-hour check
const handleVote = (videoId) => {
  setSelectedVideo(videoId);
  setShowVotingModal(true);
};

  const submitVote = async () => {
    if (isVoting) return; // Prevent double-clicks
    setIsVoting(true);
    setError(null);

    try {
    const response = await fetch(`${API_BASE}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_id: selectedVideo
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
      if (data.error === 'ALREADY_VOTED_TODAY') {
        alert('You have already voted today. Please come back tomorrow to vote again!');
      } else {
        alert(data.error || 'Failed to submit vote');
      }
      setShowVotingModal(false);
    }
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Network error. Please try again.');
      setShowVotingModal(false);
    } finally {
      setIsVoting(false);
    }
  };

  // Share functionality
  const handleShare = (video) => {
    const shareUrl = `${window.location.origin}?video=${video.id}`;
    const shareText = `Check out "${video.title}" by ${video.creator} in the SHE IS AI video competition!`;
    
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback to Twitter share
      window.shareOnTwitter(shareText, shareUrl);
    }
  };

  // Navigation component - minimal bar (logo + hamburger), full-screen panel for links/CTA
const Navigation = ({ onGoHome, menuOpen, setMenuOpen }) => {
  // Close on Esc
  useEffect(() => {
    const onKeyDown = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [setMenuOpen]);

  // Lock body scroll while menu is open
  useEffect(() => {
    if (menuOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu  = () => setMenuOpen(false);
  const goHomeAndClose = () => {
    setMenuOpen(false);
    if (typeof onGoHome === 'function') onGoHome();
  };

  return (
    <nav className="bg-black border-b border-gray-800 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: logo left, hamburger right (no desktop links/CTA) */}
        <div className="h-16 flex items-center">
          <a href="https://sheisai.ai" className="flex-shrink-0">
            <img src="/assets/sheisai-logo.png" alt="SHE IS AI" className="h-8 w-auto" />
          </a>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-controls="nav-panel"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
            className="ml-auto p-2 rounded-md border border-gray-700 text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Full-screen slide-down panel (mobile + desktop) */}
      {menuOpen && (
        <div
          id="nav-panel"
          role="dialog"
          aria-modal="true"
          className="fixed inset-x-0 top-16 bottom-0 z-40 bg-black/95 backdrop-blur-sm border-t border-gray-800 overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Close / Back to Main Page */}
            <button
              onClick={goHomeAndClose}
              className="w-full text-left flex items-center justify-between px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white mb-4"
            >
              <span>× Close — Back to Main Page</span>
            </button>

            {/* Links (stack on mobile, grid on larger screens) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <a onClick={closeMenu} className="block text-white hover:text-gray-300 transition text-base sm:text-sm font-light uppercase tracking-wide" href="https://sheisai.ai/ai-fashion-awards">AI FASHION AWARDS</a>
              <a onClick={closeMenu} className="block text-white hover:text-gray-300 transition text-base sm:text-sm font-light uppercase tracking-wide" href="https://sheisai.ai/magazine">MAGAZINE</a>
              <a onClick={closeMenu} className="block text-white hover:text-gray-300 transition text-base sm:text-sm font-light uppercase tracking-wide" href="https://sheisai.ai/she-is-ai-community">5 PILLARS</a>
              <a onClick={closeMenu} className="block text-white hover:text-gray-300 transition text-base sm:text-sm font-light uppercase tracking-wide" href="https://sheisai.ai/xpert-agency">AGENCY</a>
              <a onClick={closeMenu} className="block text-white hover:text-gray-300 transition text-base sm:text-sm font-light uppercase tracking-wide" href="https://sheisai.ai/metaverse-gallery">METAVERSE</a>
              <a onClick={closeMenu} className="block text-white hover:text-gray-300 transition text-base sm:text-sm font-light uppercase tracking-wide" href="https://sheisai.ai/she-is-ai-news">NEWS</a>
              <a onClick={closeMenu} className="block text-white hover:text-gray-300 transition text-base sm:text-sm font-light uppercase tracking-wide" href="https://sheisai.ai/about">ABOUT</a>
              <a onClick={closeMenu} className="block text-white hover:text-gray-300 transition text-base sm:text-sm font-light uppercase tracking-wide" href="https://sheisai.ai/contact-us">CONTACT</a>

              {/* CTA inside the panel */}
              <a
                onClick={closeMenu}
                href="https://sheisai.ai/become-a-member"
                className="mt-2 inline-flex w-full justify-center items-center rounded-md border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-black px-6 py-2 text-sm font-bold uppercase tracking-wide transition"
              >
                BECOME A MEMBER
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};


  // Privacy Policy Page
  const PrivacyPolicyPage = () => (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-yellow-400">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg mb-6">
            <strong>Privacy:</strong> We value your privacy. When you subscribe, we collect your name and email 
            address solely for communication for the purposes of updating you about upcoming 
            news and opportunities from SHE IS AI. We do not sell or share your personal 
            information with third parties. You can unsubscribe at any time.
          </p>

          <p className="mb-6">
            <strong>SHE IS AI</strong> is committed to protecting your privacy.
          </p>

          <p className="mb-6">
            When you subscribe, register, or purchase from our site (https://sheisai.ai or 
            https://sheisaiart.com), we may collect certain personal information, such as your name and email address.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-yellow-400">How we use your information:</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>To communicate with you about <strong>news, events, promotions, and opportunities</strong> related to SHE IS AI</li>
            <li>To fulfill your orders and manage transactions on our merch store</li>
            <li>To improve our website and services</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 text-yellow-400">We do NOT:</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Sell your personal information</li>
            <li>Share your personal information with third parties, except as required to provide services (such as payment processors or mailing platforms), or to comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Cookies:</h2>
          <p className="mb-6">
            Our site may use cookies to enhance your browsing experience and to collect non-personal 
            data (such as analytics on site usage).
          </p>

          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Your choices:</h2>
          <p className="mb-6">
            You can unsubscribe from our email communications at any time. You can also manage cookie 
            settings in your browser.
          </p>

          <p className="mb-6">
            For questions about this policy, contact: <strong>sheisai@sheisai.ai</strong>
          </p>
        </div>

        <button 
          onClick={() => setCurrentPage('home')}
          className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Back to Competition
        </button>
      </div>
    </div>
  );

  // Terms of Use Page
  const TermsOfUsePage = () => (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-yellow-400">Terms of Use 2025</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg mb-6">
            Welcome to <strong>SHE IS AI</strong> (https://sheisai.ai and https://sheisaiart.com).
          </p>

          <p className="mb-6">
            By accessing and using this site, you agree to the following terms:
          </p>

          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Content:</h2>
          <p className="mb-6">
            All content, images, designs, articles, and materials on this site are the property of SHE IS AI or 
            its contributors, and may not be reproduced, copied, or used for commercial purposes without permission.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Community Conduct:</h2>
          <p className="mb-6">
            When participating in SHE IS AI communities (such as Skool or events), users agree to engage 
            respectfully and professionally. We reserve the right to remove members who violate community standards.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Purchases:</h2>
          <p className="mb-6">
            All sales from <strong>sheisaiart.com</strong> are subject to our Refund Policy (see link).
          </p>

          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Disclaimer:</h2>
          <p className="mb-6">
            Content on this site is provided for educational and informational purposes only. It does not 
            constitute legal, financial, or medical advice.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Changes:</h2>
          <p className="mb-6">
            SHE IS AI reserves the right to update these terms at any time.
          </p>

          <p className="mb-6">
            <strong>Questions? Contact:</strong> sheisai@sheisai.ai
          </p>
        </div>

        <button 
          onClick={() => setCurrentPage('home')}
          className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Back to Competition
        </button>
      </div>
    </div>
  );

  // Main Home Page
  const HomePage = () => (
    <>
      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight uppercase leading-tight mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          WE REWRITE <span className="text-yellow-400">THE LIGHT</span>
          </h1>
          
          <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto">
            Vote for your favorite video in the SHE IS AI theme song competition. Community voting to select the winner.
          </p>
          
          <p className="text-sm text-yellow-400 mb-8 max-w-2xl mx-auto">
            Vote daily for your favorites while the clock is ticking!
            Simple, quick, and your voice matters.
          </p>

          {/* Countdown Timer */}
          <div className="mb-8">
            <div className="flex justify-center space-x-4 sm:space-x-8 mb-4">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-400">{timeLeft.days || 0}</div>
                <div className="text-sm text-gray-300">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-400">{timeLeft.hours || 0}</div>
                <div className="text-sm text-gray-300">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-400">{timeLeft.minutes || 0}</div>
                <div className="text-sm text-gray-300">MINUTES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-400">{timeLeft.seconds || 0}</div>
                <div className="text-sm text-gray-300">SECONDS</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('submissions').scrollIntoView({ behavior: 'smooth' })}
              className="vote-button"
            >
              🗳️ START VOTING
            </button>
            <button 
              onClick={() => document.getElementById('leaderboard').scrollIntoView({ behavior: 'smooth' })}
              className="secondary-button"
            >
              🏆 VIEW LEADERBOARD
            </button>
          </div>

          {/* Statistics */}
          <div className="mt-12 flex justify-center space-x-8 sm:space-x-16">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{totalVotes}</div>
              <div className="text-sm text-gray-300">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{videoSubmissions.length}</div>
              <div className="text-sm text-gray-300">Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400">0</div>
              <div className="text-sm text-gray-300">Participants</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Video */}
      <section className="section-padding px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              HOW IT <span className="text-yellow-400">WORKS</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Learn how to participate in the SHE IS AI theme song competition - all rules and voting details explained in this video
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="video-card">
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
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-colors"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-2 py-1 text-sm font-semibold rounded">START HERE</span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="bg-black/70 text-white px-2 py-1 text-sm rounded">{featuredVideo.duration}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{featuredVideo.title}</h3>
                <p className="text-gray-400 text-sm">{featuredVideo.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Competition Submissions */}
      <section id="submissions" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              COMPETITION <span className="text-yellow-400">SUBMISSIONS</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Vote for your favorite interpretation of "We Rewrite the Light" by talented creators from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoSubmissions.map(renderSubmissionCard)}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section id="leaderboard" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-yellow-400">LEADERBOARD</span>
            </h2>
            <p className="text-lg text-gray-300">Current standings in the competition</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              {videoSubmissions
                .sort((a, b) => b.votes - a.votes)
                .map((video, index) => (
                  <div key={video.id} className={`flex items-center justify-between p-4 ${index < videoSubmissions.length - 1 ? 'border-b border-gray-800' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-400 text-black' : 
                        index === 1 ? 'bg-gray-400 text-black' : 
                        index === 2 ? 'bg-yellow-600 text-white' : 
                        'bg-gray-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{video.title}</h3>
                        <p className="text-gray-400 text-sm">by {video.creator}</p>
                      </div>
                    </div>
                    <div className="text-yellow-400 font-bold">
                      {video.votes} votes
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            About <span className="text-yellow-400">SHE IS AI</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            SHE IS AI is a global community empowering women in artificial intelligence through education, 
            networking, and opportunity creation. Join us in rewriting the future of AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://sheisai.ai/magazine" className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Read Our Magazine
            </a>
            <a href="https://sheisai.ai/she-is-ai-community" className="secondary-button">
              Join Our Community
            </a>
          </div>
        </div>
      </section>
    </>
  );

  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/assets/sheisai-logo.png" 
                alt="SHE IS AI" 
                className="footer-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-yellow-400 font-bold text-lg hidden">SHE IS AI</span>
            </div>
            <p className="text-gray-300 text-sm">
              Empowering women in AI through community, education, and opportunity.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://sheisai.ai" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="https://sheisai.ai/about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              <li><a href="https://sheisai.ai/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">SHE IS AI</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://sheisai.ai/magazine" className="text-gray-300 hover:text-white transition-colors">Read Magazine</a></li>
              <li><a href="https://sheisai.ai/she-is-ai-community" className="text-gray-300 hover:text-white transition-colors">Join Community</a></li>
              <li><a href="https://sheisai.ai/ai-fashion-awards" className="text-gray-300 hover:text-white transition-colors">AI Fashion Awards</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/sheisai.ai/" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
              <a href="https://linkedin.com/company/sheisai" className="text-gray-300 hover:text-white transition-colors">LinkedIn</a>
              <a href="https://twitter.com/SHEISAIOfficial" className="text-gray-300 hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2025 | SHE IS AI ™ | All rights reserved | 
            <button onClick={() => setCurrentPage('privacy')} className="hover:text-white transition-colors ml-1"> Privacy Policy</button> | 
            <button onClick={() => setCurrentPage('terms')} className="hover:text-white transition-colors ml-1"> Terms of Use</button>
          </p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'privacy' && <PrivacyPolicyPage />}
      {currentPage === 'terms' && <TermsOfUsePage />}
      
      {currentPage === 'home' && <Footer />}

      {/* Simplified Voting Modal */}
      {showVotingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">Confirm Your Vote</h3>
            {error && (
              <div className="bg-red-600 text-white p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <p className="text-gray-300 mb-6">
              You're about to vote for "{videoSubmissions.find(v => v.id === selectedVideo)?.title}". 
              Make sure you're logged into your social media accounts for the best experience.
            </p>
            
            <div className="flex space-x-4">
              <button 
                onClick={submitVote}
                disabled={isVoting}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isVoting
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-yellow-400 hover:bg-yellow-500 text-black'
            }`}

              >
                {isVoting ? 'SUBMITTING...' : 'Complete Vote'}
              </button>
              <button 
                onClick={() => setShowVotingModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModal.isOpen && (
        <div className="modal-overlay">
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
              {videoModal.video?.videoUrl && videoModal.video.videoUrl !== 'https://www.youtube.com/embed/YOUR_VIDEO_ID' ? (
                <iframe
                  src={videoModal.video.videoUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl mb-4">Video Coming Soon</p>
                    <p className="text-gray-400">This video will be embedded once uploaded to YouTube</p>
                    <p className="text-gray-400 mt-2">Replace the videoUrl with actual YouTube embed link</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {imageModal.isOpen && (
        <div className="modal-overlay">
          <div className="bg-black rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h3 className="text-xl font-bold">{imageModal.image?.title}</h3>
              <button 
                onClick={closeImage}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 flex justify-center">
              <img
                src={imageModal.image?.imageUrl || imageModal.image?.thumbnail}
                alt={imageModal.image?.title}
                className="max-w-full max-h-[70vh] object-contain cursor-zoom-in"
                style={{ imageRendering: 'high-quality' }}
                onClick={(e) => {
                  if (e.target.style.transform === 'scale(2)') {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.cursor = 'zoom-in';
                  } else {
                    e.target.style.transform = 'scale(2)';
                    e.target.style.cursor = 'zoom-out';
                  }
                }}
              />
            </div>
            <div className="p-4 border-t border-gray-800">
              <p className="text-gray-300 mb-2">
                by <a href={imageModal.image?.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">{imageModal.image?.creator}</a>
              </p>
              <p className="text-gray-400">{imageModal.image?.description}</p>
            </div>
          </div>
        </div>
      )}  
    </div>
  );
}

export default App
