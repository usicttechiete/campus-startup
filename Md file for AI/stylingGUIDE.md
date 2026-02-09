# Campus Startup Network - UI/UX Styling Guide v2.0

> **Version:** 2.0 - Tailored for Existing Codebase  
> **Last Updated:** February 9, 2026  
> **Tech Stack:** React + Vite + Tailwind CSS, Node.js Backend  
> **Target Audience:** College-level students  
> **Design Philosophy:** Professional LinkedIn-inspired with Deel card-based layouts

---

## Executive Summary

This guide provides a comprehensive blueprint to overhaul the Campus Startup Network's UI/UX, transforming it into a professional, action-oriented platform inspired by LinkedIn's trustworthy aesthetic and Deel's clean card-based design.

### Current State Analysis
✅ **Strengths:**
- Mobile-first approach (480px max width)
- Tailwind CSS integration
- CSS variables system
- Clean component architecture
- Inter font (professional)
- Dark mode support

⚠️ **Areas for Improvement:**
- Enhance visual hierarchy for better scannability
- Add more professional color palette inspired by LinkedIn
- Improve card layouts with better spacing and shadows
- Refine action-oriented CTAs
- Add Quick Actions dashboard (Deel-style)
- Enhance profile page layout

---

## Table of Contents
1. [Design Principles & Philosophy](#design-principles--philosophy)
2. [Enhanced Color System](#enhanced-color-system)
3. [Typography & Hierarchy](#typography--hierarchy)
4. [Component Upgrades](#component-upgrades)
5. [Home Page Redesign](#home-page-redesign)
6. [Profile Page Redesign](#profile-page-redesign)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Code Examples](#code-examples)

---

## Design Principles & Philosophy

### Core Values
1. **Professional & Trustworthy** 
   - LinkedIn-inspired blue palette
   - Clear information hierarchy
   - Consistent spacing and alignment
   - Professional typography

2. **Action-Oriented Design**
   - Clear CTAs on every card
   - Quick Actions dashboard
   - Reduced friction in user flows
   - Visual feedback on interactions

3. **Student-Centric UX**
   - Language tailored to college students
   - Features relevant to campus startups
   - Mobile-first, thumb-friendly interface
   - Quick access to key features

4. **Clean & Scannable**
   - Card-based information architecture
   - Generous white space
   - Soft shadows for depth
   - Rounded corners for approachability

---

## Enhanced Color System

### Updated CSS Variables
Replace the current color system in `src/styles/theme.css` with this enhanced palette:

```css
:root {
  /* ═══════════════════════════════════════════════════════════════════
     PROFESSIONAL PALETTE - LinkedIn-Inspired
  ════════════════════════════════════════════════════════════════════ */
  
  /* Primary - Professional Blue (LinkedIn-style) */
  --color-primary: #0A66C2;              /* LinkedIn Blue */
  --color-primary-900: #004182;          /* Darkest */
  --color-primary-700: #0A66C2;          /* Primary */
  --color-primary-500: #2D7FD2;          /* Lighter */
  --color-primary-300: #70A9E0;          /* Hover states */
  --color-primary-100: #D9E9F7;          /* Backgrounds */
  --color-primary-50: #EFF6FF;           /* Light backgrounds */
  --color-primary-soft: rgba(10, 102, 194, 0.08);
  --color-primary-hover: #004182;
  --color-primary-glow: rgba(10, 102, 194, 0.2);

  /* Backgrounds - Clean & Professional */
  --color-bg: #F3F2EF;                   /* Page background (LinkedIn gray) */
  --color-bg-elevated: #FFFFFF;          /* Cards, elevated surfaces */
  --color-bg-card: #FFFFFF;
  --color-bg-card-hover: #FAFAFA;
  --color-bg-subtle: #F9FAFB;
  --color-bg-glass: rgba(255, 255, 255, 0.95);

  /* Text - Dark on Light */
  --color-text-primary: #000000;         /* Primary headings */
  --color-text-secondary: #00000099;     /* 60% opacity - body text */
  --color-text-muted: #00000099;         /* 40% opacity - secondary info */
  --color-text-disabled: #00000040;
  --color-text-inverted: #FFFFFF;

  /* Semantic Colors */
  --color-success: #057642;              /* Success green */
  --color-success-soft: rgba(5, 118, 66, 0.1);
  --color-success-100: #D1F4E0;

  --color-warning: #915907;              /* Warning orange/brown */
  --color-warning-soft: rgba(145, 89, 7, 0.1);
  --color-warning-100: #FFF4E5;

  --color-danger: #CC1016;               /* Error red */
  --color-danger-soft: rgba(204, 16, 22, 0.1);
  --color-danger-100: #FFE5E5;

  --color-info: #0A66C2;                 /* Info blue (same as primary) */
  --color-info-soft: rgba(10, 102, 194, 0.1);
  --color-info-100: #D9E9F7;

  /* Borders & Dividers */
  --color-border: #00000014;             /* 8% opacity */
  --color-border-strong: #0000001F;      /* 12% opacity */
  --color-border-hover: #00000029;       /* 16% opacity */
  --color-divider: #00000014;

  /* Shadows - Subtle depth */
  --shadow-sm: 0 0 0 1px rgba(0, 0, 0, 0.08), 
               0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 0 0 1px rgba(0, 0, 0, 0.08),
               0 2px 4px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 0 0 1px rgba(0, 0, 0, 0.08),
               0 4px 12px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 0 0 1px rgba(0, 0, 0, 0.08),
               0 8px 24px rgba(0, 0, 0, 0.15);
  --shadow-card: 0 0 0 1px rgba(0, 0, 0, 0.08),
                 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-glow: 0 0 0 4px var(--color-primary-soft);

  /* Spacing - Consistent 4px grid */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Border Radius - Softer, more approachable */
  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
  --text-4xl: 36px;

  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  /* Z-index Scale */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-toast: 400;
  --z-navbar: 500;
}
```

### Updated Tailwind Config
Update `tailwind.config.js` to use the new colors:

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // Primary LinkedIn Blue
        primary: {
          DEFAULT: 'var(--color-primary)',
          900: 'var(--color-primary-900)',
          700: 'var(--color-primary-700)',
          500: 'var(--color-primary-500)',
          300: 'var(--color-primary-300)',
          100: 'var(--color-primary-100)',
          50: 'var(--color-primary-50)',
        },
        // Backgrounds
        bg: {
          DEFAULT: 'var(--color-bg)',
          elevated: 'var(--color-bg-elevated)',
          card: 'var(--color-bg-card)',
          subtle: 'var(--color-bg-subtle)',
        },
        // Semantic
        success: {
          DEFAULT: 'var(--color-success)',
          soft: 'var(--color-success-soft)',
          100: 'var(--color-success-100)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          soft: 'var(--color-warning-soft)',
          100: 'var(--color-warning-100)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          soft: 'var(--color-danger-soft)',
          100: 'var(--color-danger-100)',
        },
        // Text
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          disabled: 'var(--color-text-disabled)',
        },
        // Borders
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
          hover: 'var(--color-border-hover)',
        },
      },
      maxWidth: {
        app: '480px',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
      },
    },
  },
  plugins: [],
};
```

---

## Typography & Hierarchy

### Font Weights
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Usage Guidelines
- **Page Titles**: text-3xl (30px), font-bold, text-primary
- **Section Headers**: text-2xl (24px), font-semibold, text-primary
- **Card Titles**: text-lg (18px), font-semibold, text-primary
- **Body Text**: text-base (16px), font-normal, text-secondary
- **Meta/Captions**: text-sm (14px), font-normal, text-muted
- **Buttons**: text-sm (14px), font-semibold

### Line Heights
```css
--line-height-tight: 1.25;     /* Headings */
--line-height-normal: 1.5;     /* Body */
--line-height-relaxed: 1.75;   /* Long-form */
```

---

## Component Upgrades

### 1. Enhanced Card Component

**Updated Card.jsx:**
```jsx
import clsx from 'clsx';
import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  className = '', 
  onClick,
  hover = true,
  padding = 'default',
  ...props 
}, ref) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={clsx(
        // Base styles
        'bg-bg-elevated rounded-xl border border-border shadow-card',
        'transition-all duration-200',
        // Hover effect
        hover && 'hover:shadow-md hover:border-border-hover',
        // Interactive cursor
        onClick && 'cursor-pointer',
        // Padding
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
```

### 2. Enhanced Button Component

**Updated Button.jsx:**
```jsx
import clsx from 'clsx';

const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 outline-none';

const variants = {
  primary: clsx(
    'bg-primary text-white shadow-sm',
    'hover:bg-primary-900',
    'active:scale-98',
    'focus:ring-4 focus:ring-primary-soft'
  ),
  secondary: clsx(
    'bg-white text-primary border border-primary',
    'hover:bg-primary-50',
    'focus:ring-4 focus:ring-primary-soft'
  ),
  ghost: clsx(
    'bg-transparent text-text-secondary',
    'hover:bg-bg-subtle',
    'focus:ring-4 focus:ring-primary-soft'
  ),
  danger: clsx(
    'bg-danger text-white',
    'hover:bg-red-700',
    'focus:ring-4 focus:ring-danger-soft'
  ),
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

### 3. New Badge Component

**Create src/components/Badge/Badge.jsx:**
```jsx
import clsx from 'clsx';

const variants = {
  success: 'bg-success-100 text-success border-success/20',
  warning: 'bg-warning-100 text-warning border-warning/20',
  danger: 'bg-danger-100 text-danger border-danger/20',
  info: 'bg-info-100 text-info border-info/20',
  neutral: 'bg-bg-subtle text-text-secondary border-border',
  primary: 'bg-primary-100 text-primary border-primary/20',
};

const Badge = ({ 
  children, 
  variant = 'neutral',
  className = '',
  ...props 
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-3 py-1',
        'text-xs font-medium rounded-full border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
```

### 4. New Avatar Component

**Create src/components/Avatar/Avatar.jsx:**
```jsx
import clsx from 'clsx';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

const Avatar = ({ 
  src, 
  alt = '', 
  size = 'md', 
  fallback,
  className = '',
  ...props 
}) => {
  const initials = fallback || alt?.slice(0, 2).toUpperCase() || '?';

  return (
    <div
      className={clsx(
        'relative inline-flex items-center justify-center rounded-full',
        'bg-primary-100 text-primary font-semibold flex-shrink-0',
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
```

---

## Home Page Redesign

### Structure Overview
```
┌─────────────────────────────────┐
│    Top Header (Sticky)          │  ← New: Logo + Search + Notifications
├─────────────────────────────────┤
│                                 │
│  Quick Actions Card (Deel)      │  ← NEW: Priority actions
│  ┌───────────────────────────┐  │
│  │ 📊 Upcoming Actions       │  │
│  │ • No pending approvals    │  │
│  │ • 3 new job postings      │  │
│  └───────────────────────────┘  │
│                                 │
├─────────────────────────────────┤
│  Filter Chips (Horizontal)      │  ← Enhanced: Better styling
│  [All] [Ideation] [MVP] [...]  │
├─────────────────────────────────┤
│                                 │
│  Feed Cards                     │  ← Improved: Better spacing
│  ┌───────────────────────────┐  │
│  │ Project Post Card         │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ Update Card               │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
    Bottom Navigation Bar
```

### New Component: QuickActionsCard

**Create src/components/QuickActionsCard/QuickActionsCard.jsx:**
```jsx
import Card from '../Card/Card.jsx';
import Button from '../Button/Button.jsx';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const ActionIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const QuickActionsCard = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-4" padding="lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
          <ActionIcon className="text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
      </div>

      {/* Action Items */}
      <div className="space-y-3">
        <ActionItem
          label={stats?.pendingApprovals > 0 
            ? `${stats.pendingApprovals} pending approvals` 
            : 'No pending approvals'}
          action={stats?.pendingApprovals > 0 ? 'Review' : null}
          onClick={() => navigate('/pending')}
          disabled={!stats?.pendingApprovals}
        />
        <ActionItem
          label={stats?.newJobs > 0 
            ? `${stats.newJobs} new job postings` 
            : 'No new job postings'}
          action={stats?.newJobs > 0 ? 'View' : null}
          onClick={() => navigate('/internships')}
          disabled={!stats?.newJobs}
        />
        <ActionItem
          label="Create new post"
          action="Post"
          onClick={() => {/* Open post modal */}}
        />
      </div>
    </Card>
  );
};

const ActionItem = ({ label, action, onClick, disabled }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className={clsx(
        'text-sm',
        disabled ? 'text-text-muted' : 'text-text-secondary'
      )}>
        {label}
      </span>
      {action && (
        <Button
          size="sm"
          variant={disabled ? 'ghost' : 'secondary'}
          onClick={onClick}
          disabled={disabled}
        >
          {action}
        </Button>
      )}
    </div>
  );
};

export default QuickActionsCard;
```

### Enhanced PostCard Component

**Update src/components/PostCard/PostCard.jsx structure:**
```jsx
// Key improvements:
// 1. Better avatar/author layout
// 2. Clear action buttons
// 3. Improved spacing
// 4. Better visual hierarchy

import Card from '../Card/Card.jsx';
import Avatar from '../Avatar/Avatar.jsx';
import Badge from '../Badge/Badge.jsx';
import Button from '../Button/Button.jsx';

const PostCard = ({ post }) => {
  const { author, title, description, stage, skills, timeAgo } = post;

  return (
    <Card hover className="mb-4">
      {/* Author Section */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar src={author.avatar} alt={author.name} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate">
            {author.name}
          </h3>
          <p className="text-xs text-text-muted">
            {author.title} • {timeAgo}
          </p>
        </div>
        <Badge variant="info">{stage}</Badge>
      </div>

      {/* Content */}
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {title}
        </h2>
        <p className="text-sm text-text-secondary line-clamp-3">
          {description}
        </p>
      </div>

      {/* Skills Tags */}
      {skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map(skill => (
            <span 
              key={skill}
              className="px-2 py-1 text-xs bg-bg-subtle rounded-full text-text-secondary"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <Button variant="primary" size="sm" className="flex-1">
          Apply
        </Button>
        <Button variant="ghost" size="sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </Button>
      </div>
    </Card>
  );
};

export default PostCard;
```

### Enhanced Filter Bar

**Update src/components/FilterBar/FilterBar.jsx:**
```jsx
import clsx from 'clsx';

const FilterChip = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
        'border whitespace-nowrap',
        active ? [
          'bg-primary text-white border-primary',
          'shadow-sm'
        ] : [
          'bg-white text-text-secondary border-border',
          'hover:border-border-hover'
        ]
      )}
    >
      {label}
    </button>
  );
};

const FilterBar = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="mb-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {filters.map((filter) => (
          <FilterChip
            key={filter.value}
            label={filter.label}
            active={activeFilter === filter.value}
            onClick={() => onFilterChange(filter.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
```

---

## Profile Page Redesign

### Structure Overview
```
┌─────────────────────────────────┐
│  Profile Header                 │
│  ┌─────────────────────────┐    │
│  │ Banner (gradient)       │    │
│  │                         │    │
│  │  👤 Avatar (overlap)    │    │
│  └─────────────────────────┘    │
│                                 │
│  John Doe • Verified ✓          │
│  CS Student • IIT Delhi         │
│  📍 New Delhi • 500+ conn.      │
│                                 │
│  [Connect] [Message] [•••]      │
├─────────────────────────────────┤
│  About Card                     │
│  Skills Card                    │
│  Experience Cards               │
│  Projects Card                  │
└─────────────────────────────────┘
```

### Profile Header Component

**Create src/components/ProfileHeader/ProfileHeader.jsx:**
```jsx
import Avatar from '../Avatar/Avatar.jsx';
import Button from '../Button/Button.jsx';
import Badge from '../Badge/Badge.jsx';
import Card from '../Card/Card.jsx';

const ProfileHeader = ({ user, isOwnProfile }) => {
  return (
    <Card padding="none" className="mb-4 overflow-hidden">
      {/* Banner */}
      <div 
        className="h-32 bg-gradient-to-r from-primary-500 to-primary-700"
        style={{ backgroundImage: user.banner && `url(${user.banner})` }}
      />

      {/* Main Content */}
      <div className="px-4 pb-4">
        {/* Avatar - overlap banner */}
        <div className="-mt-12 mb-3">
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="xl"
            className="border-4 border-white shadow-lg"
          />
        </div>

        {/* Name & Title */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-text-primary">
              {user.name}
            </h1>
            {user.verified && (
              <Badge variant="success">
                ✓ Verified
              </Badge>
            )}
          </div>
          <p className="text-base text-text-secondary">
            {user.title} • {user.college}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-sm text-text-muted mb-4">
          {user.location && (
            <span className="flex items-center gap-1">
              📍 {user.location}
            </span>
          )}
          {user.website && (
            <a href={user.website} className="flex items-center gap-1 text-primary hover:underline">
              🔗 {user.websiteName || 'Website'}
            </a>
          )}
          <span>{user.connections}+ connections</span>
        </div>

        {/* Action Buttons */}
        {!isOwnProfile ? (
          <div className="flex gap-2">
            <Button variant="primary" className="flex-1">
              Connect
            </Button>
            <Button variant="secondary" className="flex-1">
              Message
            </Button>
            <Button variant="ghost" className="px-3">
              •••
            </Button>
          </div>
        ) : (
          <Button variant="secondary" className="w-full">
            Edit Profile
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProfileHeader;
```

### Profile Section Cards

**Create src/components/ProfileSection/ProfileSection.jsx:**
```jsx
import Card from '../Card/Card.jsx';
import Button from '../Button/Button.jsx';

const ProfileSection = ({ 
  title, 
  icon, 
  children, 
  onEdit,
  action 
}) => {
  return (
    <Card className="mb-4" padding="lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
          <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        </div>
        {(onEdit || action) && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onEdit || action.onClick}
          >
            {action?.label || 'Edit'}
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  );
};

// Experience Item Component
export const ExperienceItem = ({ experience }) => {
  return (
    <div className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
      {/* Company Logo */}
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-bg-subtle">
        {experience.logo ? (
          <img src={experience.logo} alt={experience.company} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xl">
            {experience.company[0]}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text-primary">
          {experience.title}
        </h3>
        <p className="text-sm text-text-secondary">
          {experience.company}
        </p>
        <p className="text-xs text-text-muted mt-1">
          {experience.period} • {experience.duration}
        </p>
        {experience.description && (
          <p className="text-sm text-text-secondary mt-2 line-clamp-3">
            {experience.description}
          </p>
        )}
      </div>
    </div>
  );
};

// Skills Component
export const SkillsList = ({ skills }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="px-3 py-1.5 bg-primary-50 text-primary rounded-full text-sm font-medium"
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

export default ProfileSection;
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Update CSS variables in `theme.css`
- [ ] Update Tailwind config
- [ ] Test dark mode compatibility
- [ ] Update global styles

### Phase 2: Core Components (Week 1-2)
- [ ] Update Button component
- [ ] Update Card component
- [ ] Create Avatar component
- [ ] Create Badge component
- [ ] Update FilterBar component

### Phase 3: Home Page (Week 2)
- [ ] Create QuickActionsCard component
- [ ] Update PostCard component
- [ ] Enhance FilterBar styling
- [ ] Update Home page layout
- [ ] Add pull-to-refresh polish

### Phase 4: Profile Page (Week 3)
- [ ] Create ProfileHeader component
- [ ] Create ProfileSection component
- [ ] Create ExperienceItem component
- [ ] Create SkillsList component
- [ ] Update Profile page layout

### Phase 5: Polish & Testing (Week 3-4)
- [ ] Test all components on mobile
- [ ] Ensure consistent spacing
- [ ] Add loading states
- [ ] Test dark mode
- [ ] Performance optimization
- [ ] Accessibility audit

---

## Code Examples

### Example: Updated Home Page Integration

**src/pages/Home/Home.jsx (snippet):**
```jsx
import QuickActionsCard from '../../components/QuickActionsCard/QuickActionsCard.jsx';
import FilterBar from '../../components/FilterBar/FilterBar.jsx';
import PostCard from '../../components/PostCard/PostCard.jsx';
import Button from '../../components/Button/Button.jsx';

const Home = () => {
  const { posts, loading, filters } = useFeedPosts();
  const [activeFilter, setActiveFilter] = useState('all');
  
  const stats = {
    pendingApprovals: 0,
    newJobs: 3,
  };

  return (
    <div className="min-h-screen bg-bg pb-20">
      {/* Container with max-width */}
      <div className="max-w-app mx-auto px-4 py-4">
        
        {/* Quick Actions - Deel inspired */}
        <QuickActionsCard stats={stats} />

        {/* Filter Bar */}
        <FilterBar
          filters={stageFilters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Posts Feed */}
        <div className="space-y-4">
          {loading ? (
            <Loader />
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>

        {/* FAB for creating posts */}
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <PlusIcon className="w-6 h-6 mx-auto" />
        </button>
      </div>
    </div>
  );
};
```

### Example: Updated Profile Page Integration

**src/pages/Profile/StudentProfile.jsx (snippet):**
```jsx
import ProfileHeader from '../../components/ProfileHeader/ProfileHeader.jsx';
import ProfileSection, { ExperienceItem, SkillsList } from '../../components/ProfileSection/ProfileSection.jsx';

const StudentProfile = () => {
  const { user, experiences, skills } = useProfile();

  return (
    <div className="min-h-screen bg-bg pb-20">
      <div className="max-w-app mx-auto px-4 py-4">
        
        {/* Profile Header */}
        <ProfileHeader user={user} isOwnProfile={true} />

        {/* About Section */}
        <ProfileSection title="About">
          <p className="text-sm text-text-secondary leading-relaxed">
            {user.bio}
          </p>
        </ProfileSection>

        {/* Skills Section */}
        <ProfileSection 
          title="Skills" 
          onEdit={() => {/* Open edit modal */}}
        >
          <SkillsList skills={skills} />
        </ProfileSection>

        {/* Experience Section */}
        <ProfileSection title="Experience">
          {experiences.map(exp => (
            <ExperienceItem key={exp.id} experience={exp} />
          ))}
        </ProfileSection>

      </div>
    </div>
  );
};
```

---

## Best Practices

### DO's ✅
- Use CSS variables for all colors and spacing
- Maintain consistent border-radius across components
- Use proper semantic HTML
- Ensure touch targets are at least 44x44px
- Test on real mobile devices
- Use loading states for all async operations
- Implement proper error handling

### DON'Ts ❌
- Don't use arbitrary colors outside the design system
- Don't use inconsistent spacing
- Don't create components without accessibility in mind
- Don't skip mobile testing
- Don't use heavy animations
- Don't hardcode values that should be CSS variables

---

## Accessibility Checklist

- [ ] All interactive elements have focus states
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Touch targets meet 44x44px minimum
- [ ] No reliance on color alone for information

---

## Performance Guidelines

1. **Code Splitting**: Lazy load components not needed on initial render
2. **Image Optimization**: Use WebP format, lazy load images
3. **CSS**: Keep styles modular, avoid unnecessary global styles
4. **Bundle Size**: Monitor and keep under control
5. **Memoization**: Use React.memo for expensive components

---

## Resources & References

- **LinkedIn Design System**: For professional UI patterns
- **Deel**: For card-based, action-oriented layouts
- **Tailwind CSS Docs**: https://tailwindcss.com
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Inter Font**: https://fonts.google.com/specimen/Inter

---

## Changelog

**v2.0 (Feb 2026):**
- Analyzed existing codebase
- Created LinkedIn-inspired color palette
- Designed Deel-style Quick Actions card
- Enhanced component library
- Provided implementation roadmap
- Added code examples for Home and Profile pages

---

**End of Styling Guide v2.0**

*This guide is tailored specifically for the Campus Startup Network codebase. All components and examples are designed to integrate seamlessly with your existing React + Vite + Tailwind setup.*