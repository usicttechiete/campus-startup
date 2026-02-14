# Availability Toggle Component

A sleek, modern availability toggle component with integrated social media links.

## Features

✅ **Smooth Toggle Animation** - Gradient-based toggle switch with smooth transitions  
✅ **Status Badge** - Clear visual indicator (Available/Unavailable)  
✅ **Social Media Integration** - LinkedIn, GitHub, and LeetCode buttons  
✅ **Space Efficient** - Compact card design with optimal spacing  
✅ **Responsive** - Shows full text on desktop, icons only on mobile  
✅ **Accessibility** - ARIA labels and keyboard navigation support  
✅ **Premium Design** - Modern glassmorphism with smooth hover effects  

## Usage

```jsx
import AvailabilityToggle from './components/AvailabilityToggle';

function Profile() {
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <AvailabilityToggle
      isAvailable={isAvailable}
      onToggle={setIsAvailable}
      socialLinks={{
        linkedin: 'https://linkedin.com/in/yourprofile',
        github: 'https://github.com/yourusername',
        leetcode: 'https://leetcode.com/yourusername'
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isAvailable` | boolean | required | Current availability status |
| `onToggle` | function | required | Callback when toggle is clicked |
| `disabled` | boolean | `false` | Disable toggle interaction |
| `loading` | boolean | `false` | Show loading state |
| `socialLinks` | object | `{}` | Social media URLs |

## Social Links Object

```js
{
  linkedin: 'https://linkedin.com/in/yourprofile',  // Optional
  github: 'https://github.com/yourusername',        // Optional
  leetcode: 'https://leetcode.com/yourusername'     // Optional
}
```

*Note: If a URL is not provided, the button will be disabled and grayed out.*

---

## 🎨 Recommended Improvements & Customizations

### 1. **Add More Social Platforms**
Add support for additional platforms based on your needs:

```jsx
// Add to the component:
const additionalSocials = {
  twitter: {
    name: 'Twitter/X',
    icon: <XIcon />,
    color: 'hover:bg-black hover:text-white',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-900'
  },
  portfolio: {
    name: 'Portfolio',
    icon: <GlobeIcon />,
    color: 'hover:bg-purple-600 hover:text-white',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
  email: {
    name: 'Email',
    icon: <MailIcon />,
    color: 'hover:bg-red-600 hover:text-white',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600'
  }
}
```

### 2. **Add Animation Library** (Optional)
For even smoother animations, consider using Framer Motion:

```bash
npm install framer-motion
```

```jsx
import { motion } from 'framer-motion';

// Replace the card div with:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-white rounded-2xl..."
>
```

### 3. **Dark Mode Support**
Add dark mode variants:

```jsx
className={`
  bg-white dark:bg-gray-800 
  text-gray-900 dark:text-white
  border-gray-100 dark:border-gray-700
  ...
`}
```

### 4. **Copy Social Link to Clipboard**
Add a copy button feature:

```jsx
const copyToClipboard = (url) => {
  navigator.clipboard.writeText(url);
  // Show toast notification
};

// Add onClick to social buttons
onClick={(e) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    copyToClipboard(social.url);
  }
}}
```

### 5. **Analytics Tracking**
Track when users click on social links:

```jsx
const handleSocialClick = (platform) => {
  // Analytics tracking
  if (window.gtag) {
    gtag('event', 'social_click', {
      platform: platform,
      user_id: userId
    });
  }
};
```

### 6. **Status History/Last Updated**
Show when availability was last updated:

```jsx
<p className="text-xs text-gray-400 mt-1">
  Updated {formatDistance(lastUpdated, new Date())} ago
</p>
```

### 7. **Notification Badge**
Add unread message counter on social buttons:

```jsx
<a className="relative...">
  {social.icon}
  {social.unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
      {social.unreadCount}
    </span>
  )}
</a>
```

### 8. **Scheduled Availability**
Allow users to schedule when they'll be available:

```jsx
<div className="mt-2">
  <select className="text-xs rounded border">
    <option>Available until...</option>
    <option>End of day</option>
    <option>End of week</option>
    <option>Custom date</option>
  </select>
</div>
```

### 9. **Tooltip on Hover**
Show additional info on hover:

```jsx
// Using a tooltip library like react-tooltip
<span data-tooltip-id="status-tooltip">
  Available
</span>
<Tooltip id="status-tooltip">
  You'll receive job offers and project invitations
</Tooltip>
```

### 10. **Compact Mode Option**
Add a `compact` prop for smaller spaces:

```jsx
// Props
compact?: boolean

// Usage
{compact ? (
  <div className="flex items-center gap-2 p-3">
    {/* Horizontal layout, smaller text */}
  </div>
) : (
  <div className="p-5 space-y-4">
    {/* Full layout */}
  </div>
)}
```

---

## 🚀 Quick Demo

Open `demo.html` in your browser to see a standalone demo with working toggle and social buttons.

## 📱 Mobile Responsive

- **Desktop**: Shows full button text ("LinkedIn", "GitHub", "LeetCode")
- **Mobile**: Shows icons only for space efficiency
- **Tablet**: Adapts based on screen width

## 🎯 Best Practices

1. **Always provide at least one social link** - Otherwise the section looks empty
2. **Update availability programmatically** - Use the `loading` state during API calls
3. **Validate URLs** - Ensure social links are valid before passing them
4. **Use environment variables** - Store social links in your user profile/database
5. **Add error handling** - Handle toggle failures gracefully

## 📊 Space Efficiency Comparison

**Before**: ~150px height (separate toggle + social buttons)  
**After**: ~130px height (combined in single card)  
**Space Saved**: ~13% more compact  

---

## 🎨 Color Customization

Modify colors in the component to match your brand:

```jsx
// Toggle colors
from-green-400 to-emerald-500  // Available (green gradient)
from-gray-300 to-gray-400      // Unavailable (gray gradient)

// Social button colors
bg-blue-50 text-blue-600 hover:bg-blue-600     // LinkedIn
bg-gray-50 text-gray-700 hover:bg-gray-800     // GitHub
bg-orange-50 text-orange-600 hover:bg-orange-500  // LeetCode
```

## License

MIT - Feel free to customize and use in your projects!
