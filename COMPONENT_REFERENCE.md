# Component Reference & Showcase

## Quick Reference Guide for All Enhanced Components

---

## 🎨 Design Tokens

### Colors
```jsx
// Primary (LinkedIn Blue)
className="bg-primary"           // #0A66C2
className="bg-primary-900"       // #004182 (darkest)
className="bg-primary-100"       // #D9E9F7 (lightest)
className="text-primary"

// Backgrounds
className="bg-bg"                // #F3F2EF (page background)
className="bg-bg-elevated"       // #FFFFFF (cards)
className="bg-bg-subtle"         // #F9FAFB (subtle backgrounds)

// Text
className="text-text-primary"    // #000000 (headings)
className="text-text-secondary"  // rgba(0,0,0,0.6) (body)
className="text-text-muted"      // rgba(0,0,0,0.4) (meta)

// Semantic
className="bg-success"           // #057642
className="bg-warning"           // #915907
className="bg-danger"            // #CC1016
className="bg-info"              // #0A66C2
```

### Spacing
```jsx
className="p-4"    // 16px (default card padding)
className="p-6"    // 24px (large card padding)
className="gap-3"  // 12px (common gap)
className="gap-4"  // 16px (default gap)
```

### Shadows
```jsx
className="shadow-card"  // Subtle card shadow
className="shadow-md"    // Medium shadow
className="shadow-lg"    // Large shadow
```

---

## 📦 Component Library

### 1. Card Component

#### Basic Usage
```jsx
import Card from './components/Card/Card.jsx';

<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>
```

#### With Padding Variants
```jsx
// No padding
<Card padding="none">
  {/* Custom padding control */}
</Card>

// Small padding (12px)
<Card padding="sm">
  {/* Compact content */}
</Card>

// Default padding (16px)
<Card padding="default">
  {/* Standard content */}
</Card>

// Large padding (24px)
<Card padding="lg">
  {/* Spacious content */}
</Card>
```

#### With Hover Effect
```jsx
// With hover (default)
<Card hover={true}>
  {/* Hoverable card */}
</Card>

// Without hover
<Card hover={false}>
  {/* Static card */}
</Card>
```

#### Clickable Card
```jsx
<Card onClick={() => navigate('/details')}>
  {/* Entire card is clickable */}
</Card>
```

#### Complete Example
```jsx
<Card 
  padding="lg" 
  hover={true}
  onClick={() => console.log('clicked')}
  className="mb-4"
>
  <h2 className="text-xl font-semibold text-text-primary mb-2">
    Card Title
  </h2>
  <p className="text-sm text-text-secondary">
    Card description goes here
  </p>
</Card>
```

---

### 2. Button Component

#### Variants
```jsx
import Button from './components/Button/Button.jsx';

// Primary (LinkedIn Blue)
<Button variant="primary">
  Primary Action
</Button>

// Secondary (White with blue border)
<Button variant="secondary">
  Secondary Action
</Button>

// Ghost (Transparent)
<Button variant="ghost">
  Tertiary Action
</Button>

// Danger (Red)
<Button variant="danger">
  Delete
</Button>

// Accent (Teal)
<Button variant="accent">
  Special Action
</Button>
```

#### Sizes
```jsx
// Small
<Button size="sm">Small Button</Button>

// Medium (default)
<Button size="md">Medium Button</Button>

// Large
<Button size="lg">Large Button</Button>
```

#### States
```jsx
// Disabled
<Button disabled>
  Disabled Button
</Button>

// Loading (you can add custom loading state)
<Button disabled>
  <Loader size="sm" inline /> Loading...
</Button>
```

#### With Icons
```jsx
<Button variant="primary">
  <PlusIcon className="w-4 h-4" />
  Add Item
</Button>

<Button variant="ghost" size="sm">
  <EditIcon className="w-4 h-4" />
</Button>
```

#### Complete Example
```jsx
<div className="flex gap-2">
  <Button 
    variant="primary" 
    size="md"
    onClick={handleSubmit}
    disabled={loading}
  >
    {loading ? 'Saving...' : 'Save Changes'}
  </Button>
  
  <Button 
    variant="secondary"
    onClick={handleCancel}
  >
    Cancel
  </Button>
</div>
```

---

### 3. Badge Component

#### Variants
```jsx
import Badge from './components/Badge/Badge.jsx';

// Success (Green)
<Badge variant="success">
  ✓ Verified
</Badge>

// Warning (Orange/Brown)
<Badge variant="warning">
  ⚠ Pending
</Badge>

// Danger (Red)
<Badge variant="danger">
  ✗ Rejected
</Badge>

// Info (Blue)
<Badge variant="info">
  ℹ New
</Badge>

// Neutral (Gray)
<Badge variant="neutral">
  Draft
</Badge>

// Primary (LinkedIn Blue)
<Badge variant="primary">
  Featured
</Badge>
```

#### Use Cases
```jsx
// Status indicator
<Badge variant="success">Active</Badge>

// Count badge
<Badge variant="info">3 new</Badge>

// Category tag
<Badge variant="neutral">Technology</Badge>

// With icons
<Badge variant="success">
  <CheckIcon className="w-3 h-3" />
  Approved
</Badge>
```

---

### 4. Avatar Component

#### Sizes
```jsx
import Avatar from './components/Avatar/Avatar.jsx';

<Avatar size="sm" src={user.avatar} alt={user.name} />   // 32px
<Avatar size="md" src={user.avatar} alt={user.name} />   // 40px
<Avatar size="lg" src={user.avatar} alt={user.name} />   // 56px
<Avatar size="xl" src={user.avatar} alt={user.name} />   // 80px
<Avatar size="2xl" src={user.avatar} alt={user.name} />  // 96px
```

#### With Fallback
```jsx
// Automatic initials from alt text
<Avatar 
  src={null} 
  alt="John Doe" 
  size="md"
/>
// Shows: "JD"

// Custom fallback
<Avatar 
  src={null} 
  fallback="AB" 
  size="md"
/>
// Shows: "AB"
```

#### With Border
```jsx
<Avatar 
  src={user.avatar} 
  alt={user.name}
  size="xl"
  className="border-4 border-white shadow-lg"
/>
```

#### Complete Example
```jsx
<div className="flex items-center gap-3">
  <Avatar 
    src={user.avatar} 
    alt={user.name}
    size="lg"
  />
  <div>
    <h3 className="font-semibold text-text-primary">
      {user.name}
    </h3>
    <p className="text-sm text-text-muted">
      {user.title}
    </p>
  </div>
</div>
```

---

### 5. ProfileHeader Component

#### Basic Usage
```jsx
import ProfileHeader from './components/ProfileHeader/ProfileHeader.jsx';

<ProfileHeader 
  user={{
    avatar: user.avatar,
    name: user.name,
    title: 'Software Engineer',
    college: 'MIT',
    verified: true,
    location: 'Boston, MA',
    website: 'https://example.com',
    websiteName: 'Portfolio',
    connections: 500,
  }}
  isOwnProfile={true}
  onEditProfile={() => setEditMode(true)}
/>
```

#### For Other User's Profile
```jsx
<ProfileHeader 
  user={otherUser}
  isOwnProfile={false}
  onConnect={() => handleConnect(otherUser.id)}
  onMessage={() => handleMessage(otherUser.id)}
/>
```

#### With Custom Banner
```jsx
<ProfileHeader 
  user={{
    ...user,
    banner: 'https://example.com/banner.jpg'
  }}
  isOwnProfile={true}
/>
```

---

### 6. ProfileSection Component

#### Basic Usage
```jsx
import ProfileSection from './components/ProfileSection/ProfileSection.jsx';

<ProfileSection title="About">
  <p className="text-sm text-text-secondary leading-relaxed">
    {user.bio}
  </p>
</ProfileSection>
```

#### With Icon
```jsx
<ProfileSection 
  title="Skills" 
  icon={<span>🎯</span>}
>
  {/* Content */}
</ProfileSection>
```

#### With Edit Button
```jsx
<ProfileSection 
  title="Experience" 
  onEdit={() => setEditMode(true)}
>
  {/* Content */}
</ProfileSection>
```

#### With Custom Action
```jsx
<ProfileSection 
  title="Projects"
  action={{
    label: 'Add Project',
    onClick: () => setShowAddProject(true)
  }}
>
  {/* Content */}
</ProfileSection>
```

---

### 7. SkillsList Component

#### Basic Usage
```jsx
import { SkillsList } from './components/ProfileSection/ProfileSection.jsx';

<SkillsList skills={['React', 'Node.js', 'TypeScript']} />
```

#### In ProfileSection
```jsx
<ProfileSection title="Skills" icon={<span>🎯</span>}>
  <SkillsList skills={user.skills} />
</ProfileSection>
```

#### Empty State
```jsx
<SkillsList skills={[]} />
// Shows: "No skills added yet"
```

---

### 8. ExperienceItem Component

#### Basic Usage
```jsx
import { ExperienceItem } from './components/ProfileSection/ProfileSection.jsx';

<ExperienceItem 
  experience={{
    title: 'Software Engineer',
    company: 'Google',
    logo: 'https://example.com/google-logo.png',
    period: 'Jan 2022 - Present',
    duration: '2 years',
    description: 'Working on cloud infrastructure...'
  }}
/>
```

#### Multiple Experiences
```jsx
<ProfileSection title="Experience">
  {experiences.map(exp => (
    <ExperienceItem key={exp.id} experience={exp} />
  ))}
</ProfileSection>
```

---

### 9. QuickActionsCard Component

#### Basic Usage
```jsx
import QuickActionsCard from './components/QuickActionsCard/QuickActionsCard.jsx';

<QuickActionsCard 
  stats={{
    pendingApprovals: 3,
    newJobs: 5
  }}
/>
```

#### With No Stats
```jsx
<QuickActionsCard 
  stats={{
    pendingApprovals: 0,
    newJobs: 0
  }}
/>
// Shows: "No pending approvals", "No new job postings"
```

---

## 🎯 Common Patterns

### Pattern 1: User Card
```jsx
<Card hover className="mb-4">
  <div className="flex items-center gap-3">
    <Avatar src={user.avatar} alt={user.name} size="lg" />
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-text-primary truncate">
        {user.name}
      </h3>
      <p className="text-sm text-text-muted truncate">
        {user.title}
      </p>
    </div>
    <Button variant="secondary" size="sm">
      Connect
    </Button>
  </div>
</Card>
```

### Pattern 2: Action Card
```jsx
<Card padding="lg">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
      <Icon className="text-primary" />
    </div>
    <h2 className="text-lg font-semibold text-text-primary">
      Card Title
    </h2>
  </div>
  <div className="space-y-3">
    {/* Action items */}
  </div>
</Card>
```

### Pattern 3: List Card
```jsx
<Card padding="lg">
  <h2 className="text-xl font-semibold text-text-primary mb-4">
    List Title
  </h2>
  <div className="space-y-4">
    {items.map(item => (
      <div 
        key={item.id}
        className="pb-4 border-b border-border last:border-0 last:pb-0"
      >
        {/* Item content */}
      </div>
    ))}
  </div>
</Card>
```

### Pattern 4: Form Card
```jsx
<Card padding="lg">
  <h2 className="text-xl font-semibold text-text-primary mb-4">
    Form Title
  </h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1">
        Label
      </label>
      <input 
        type="text"
        className="w-full px-3 py-2 border border-border rounded-lg 
                   focus:ring-2 focus:ring-primary-soft focus:border-primary
                   text-text-primary"
      />
    </div>
    <div className="flex gap-2">
      <Button type="submit" variant="primary" className="flex-1">
        Submit
      </Button>
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  </form>
</Card>
```

### Pattern 5: Stats Card
```jsx
<Card padding="lg">
  <div className="grid grid-cols-2 gap-4">
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">
        Projects
      </p>
      <p className="text-2xl font-bold text-text-primary">
        12
      </p>
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">
        Connections
      </p>
      <p className="text-2xl font-bold text-text-primary">
        500+
      </p>
    </div>
  </div>
</Card>
```

---

## 🎨 Typography Scale

```jsx
// Headings
<h1 className="text-3xl font-bold text-text-primary">     // 30px
<h2 className="text-2xl font-semibold text-text-primary"> // 24px
<h3 className="text-xl font-semibold text-text-primary">  // 20px
<h4 className="text-lg font-semibold text-text-primary">  // 18px

// Body
<p className="text-base text-text-secondary">             // 16px
<p className="text-sm text-text-secondary">               // 14px
<p className="text-xs text-text-muted">                   // 12px
```

---

## 🔧 Utility Classes

### Spacing
```jsx
className="space-y-4"  // Vertical spacing between children
className="gap-3"      // Gap in flex/grid
className="p-4"        // Padding
className="mb-4"       // Margin bottom
```

### Layout
```jsx
className="flex items-center gap-3"
className="grid grid-cols-2 gap-4"
className="max-w-app mx-auto"  // Center with max width
```

### Text
```jsx
className="truncate"           // Ellipsis overflow
className="line-clamp-3"       // Clamp to 3 lines
className="font-semibold"      // 600 weight
className="font-bold"          // 700 weight
```

### Borders
```jsx
className="border border-border"
className="border-b border-border"
className="rounded-lg"
className="rounded-full"
```

---

## 📱 Responsive Patterns

### Mobile-First Container
```jsx
<div className="min-h-screen bg-bg pb-20">
  <div className="max-w-app mx-auto px-4 py-4">
    {/* Content */}
  </div>
</div>
```

### Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Items */}
</div>
```

### Responsive Flex
```jsx
<div className="flex flex-col sm:flex-row gap-4">
  {/* Items */}
</div>
```

---

## ✅ Best Practices

1. **Always use design tokens** (CSS variables) instead of hardcoded colors
2. **Use semantic variants** for badges (success, warning, danger, info)
3. **Maintain consistent spacing** with the 4px grid system
4. **Add hover states** to interactive elements
5. **Include focus states** for accessibility
6. **Use proper heading hierarchy** (h1 → h2 → h3)
7. **Keep touch targets** at least 44x44px
8. **Test on mobile** (max-width: 480px)

---

## 🚀 Quick Start Template

```jsx
import Card from './components/Card/Card.jsx';
import Button from './components/Button/Button.jsx';
import Badge from './components/Badge/Badge.jsx';
import Avatar from './components/Avatar/Avatar.jsx';

const MyPage = () => {
  return (
    <div className="min-h-screen bg-bg pb-20">
      <div className="max-w-app mx-auto px-4 py-4">
        
        <Card padding="lg" className="mb-4">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Page Title
          </h1>
          
          <div className="flex items-center gap-3 mb-4">
            <Avatar src={user.avatar} alt={user.name} size="lg" />
            <div>
              <h2 className="font-semibold text-text-primary">
                {user.name}
              </h2>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
          
          <p className="text-sm text-text-secondary mb-4">
            Description goes here
          </p>
          
          <div className="flex gap-2">
            <Button variant="primary">
              Primary Action
            </Button>
            <Button variant="secondary">
              Secondary Action
            </Button>
          </div>
        </Card>
        
      </div>
    </div>
  );
};
```

---

**Need more examples?** Check out the implementation guide and styling guide for detailed usage patterns!
