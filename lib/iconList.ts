import {
     Users, Heart, Rocket, Star, Lightbulb, Shield, Globe, Crown, Code, Target, Zap,
     Home, Settings, FileText, BookText, MessageSquare, Building2, UserCircle, Palette,
     Navigation, ArrowDown, Info, Plus, Trash2, Save, Edit, Eye, Search, Filter,
     Calendar, Clock, Mail, Phone, MapPin, Link, ExternalLink, Download, Upload,
     Check, X, AlertCircle, AlertTriangle, HelpCircle, ChevronRight, ChevronLeft, 
     ChevronUp, ChevronDown, ArrowRight, ArrowLeft, ArrowUp, Minus, Play, Pause,
     Camera, Video, File, Folder, Database, Server, Cloud, Wifi, Bluetooth, Battery,
     Power, Lock, Unlock, Key, CreditCard, DollarSign, Euro,  Bitcoin,
     TrendingUp, TrendingDown, BarChart, PieChart, LineChart, Activity, Cpu,
     Monitor, Smartphone, Tablet, Laptop, Printer, Headphones, Speaker,
      VideoOff, CameraOff, WifiOff, BluetoothOff, Cast, Share, Copy,
      Type, Bold, Italic, List, Grid, Columns, Rows, Layout, Sidebar,
     Maximize, Minimize, Move, ZoomIn, ZoomOut, RefreshCw, RefreshCcw, Shuffle,
     Bell, BellOff, Inbox, Send, Reply, Archive, ArchiveX, Trash, CloudRain,
     Sun, Moon, Cloudy, Wind, Umbrella, Compass, Map, Flag, Award, Trophy,
     Gift, Package, ShoppingCart, ShoppingBag, Wallet, Smile, Frown, Meh,
     Laugh, Angry, ThumbsUp, ThumbsDown, CheckCircle, XCircle, MinusCircle,
     PlusCircle, Circle, Square, Triangle, Hexagon, Diamond, Cross, Hash,
     Percent, AtSign
   } from 'lucide-react';
   
   export const availableIcons = [
     // Core Business Icons
     { value: 'Users', label: 'Users', icon: Users },
     { value: 'Heart', label: 'Heart', icon: Heart },
     { value: 'Rocket', label: 'Rocket', icon: Rocket },
     { value: 'Star', label: 'Star', icon: Star },
     { value: 'Lightbulb', label: 'Lightbulb', icon: Lightbulb },
     { value: 'Shield', label: 'Shield', icon: Shield },
     { value: 'Globe', label: 'Globe', icon: Globe },
     { value: 'Crown', label: 'Crown', icon: Crown },
     { value: 'Code', label: 'Code', icon: Code },
     { value: 'Target', label: 'Target', icon: Target },
     { value: 'Zap', label: 'Zap', icon: Zap },
     
     // Navigation & UI
     { value: 'Home', label: 'Home', icon: Home },
     { value: 'Settings', label: 'Settings', icon: Settings },
     { value: 'FileText', label: 'File Text', icon: FileText },
     { value: 'BookText', label: 'Book Text', icon: BookText },
     { value: 'MessageSquare', label: 'Message Square', icon: MessageSquare },
     { value: 'Building2', label: 'Building', icon: Building2 },
     { value: 'UserCircle', label: 'User Circle', icon: UserCircle },
     { value: 'Palette', label: 'Palette', icon: Palette },
     { value: 'Navigation', label: 'Navigation', icon: Navigation },
     { value: 'ArrowDown', label: 'Arrow Down', icon: ArrowDown },
     { value: 'Info', label: 'Info', icon: Info },
     
     // Actions
     { value: 'Plus', label: 'Plus', icon: Plus },
     { value: 'Trash2', label: 'Trash', icon: Trash2 },
     { value: 'Save', label: 'Save', icon: Save },
     { value: 'Edit', label: 'Edit', icon: Edit },
     { value: 'Eye', label: 'Eye', icon: Eye },
     { value: 'Search', label: 'Search', icon: Search },
     { value: 'Filter', label: 'Filter', icon: Filter },
     
     // Time & Date
     { value: 'Calendar', label: 'Calendar', icon: Calendar },
     { value: 'Clock', label: 'Clock', icon: Clock },
     
     // Communication
     { value: 'Mail', label: 'Mail', icon: Mail },
     { value: 'Phone', label: 'Phone', icon: Phone },
     { value: 'MapPin', label: 'Map Pin', icon: MapPin },
     { value: 'Link', label: 'Link', icon: Link },
     { value: 'ExternalLink', label: 'External Link', icon: ExternalLink },
     
     // Files & Data
     { value: 'Download', label: 'Download', icon: Download },
     { value: 'Upload', label: 'Upload', icon: Upload },
     { value: 'File', label: 'File', icon: File },
     { value: 'Folder', label: 'Folder', icon: Folder },
     { value: 'Database', label: 'Database', icon: Database },
     { value: 'Server', label: 'Server', icon: Server },
     { value: 'Cloud', label: 'Cloud', icon: Cloud },
     
     // Technology
     { value: 'Wifi', label: 'WiFi', icon: Wifi },
     { value: 'Bluetooth', label: 'Bluetooth', icon: Bluetooth },
     { value: 'Battery', label: 'Battery', icon: Battery },
     { value: 'Power', label: 'Power', icon: Power },
     { value: 'Lock', label: 'Lock', icon: Lock },
     { value: 'Unlock', label: 'Unlock', icon: Unlock },
     { value: 'Key', label: 'Key', icon: Key },
     
     // Finance
     { value: 'CreditCard', label: 'Credit Card', icon: CreditCard },
     { value: 'DollarSign', label: 'Dollar Sign', icon: DollarSign },
     { value: 'Euro', label: 'Euro', icon: Euro },
     { value: 'Bitcoin', label: 'Bitcoin', icon: Bitcoin },
     
     // Analytics
     { value: 'TrendingUp', label: 'Trending Up', icon: TrendingUp },
     { value: 'TrendingDown', label: 'Trending Down', icon: TrendingDown },
     { value: 'BarChart', label: 'Bar Chart', icon: BarChart },
     { value: 'PieChart', label: 'Pie Chart', icon: PieChart },
     { value: 'LineChart', label: 'Line Chart', icon: LineChart },
     { value: 'Activity', label: 'Activity', icon: Activity },
     
     // Hardware
     { value: 'Cpu', label: 'CPU', icon: Cpu },
     { value: 'Monitor', label: 'Monitor', icon: Monitor },
     { value: 'Smartphone', label: 'Smartphone', icon: Smartphone },
     { value: 'Tablet', label: 'Tablet', icon: Tablet },
     { value: 'Laptop', label: 'Laptop', icon: Laptop },
     { value: 'Printer', label: 'Printer', icon: Printer },
     
     // Audio & Video
     { value: 'Headphones', label: 'Headphones', icon: Headphones },
     { value: 'Speaker', label: 'Speaker', icon: Speaker },
     { value: 'Video', label: 'Video', icon: Video },
     { value: 'Camera', label: 'Camera', icon: Camera },
     { value: 'VideoOff', label: 'Video Off', icon: VideoOff },
     { value: 'CameraOff', label: 'Camera Off', icon: CameraOff },
     
     // Status & Feedback
     { value: 'Check', label: 'Check', icon: Check },
     { value: 'X', label: 'X', icon: X },
     { value: 'AlertCircle', label: 'Alert Circle', icon: AlertCircle },
     { value: 'AlertTriangle', label: 'Alert Triangle', icon: AlertTriangle },
     { value: 'HelpCircle', label: 'Help Circle', icon: HelpCircle },
     
     // Arrows & Navigation
     { value: 'ChevronRight', label: 'Chevron Right', icon: ChevronRight },
     { value: 'ChevronLeft', label: 'Chevron Left', icon: ChevronLeft },
     { value: 'ChevronUp', label: 'Chevron Up', icon: ChevronUp },
     { value: 'ChevronDown', label: 'Chevron Down', icon: ChevronDown },
     { value: 'ArrowRight', label: 'Arrow Right', icon: ArrowRight },
     { value: 'ArrowLeft', label: 'Arrow Left', icon: ArrowLeft },
     { value: 'ArrowUp', label: 'Arrow Up', icon: ArrowUp },
     { value: 'Minus', label: 'Minus', icon: Minus },
     
     // Media Controls
     { value: 'Play', label: 'Play', icon: Play },
     { value: 'Pause', label: 'Pause', icon: Pause },
     
     // Connectivity
     { value: 'WifiOff', label: 'WiFi Off', icon: WifiOff },
     { value: 'BluetoothOff', label: 'Bluetooth Off', icon: BluetoothOff },
     { value: 'Cast', label: 'Cast', icon: Cast },
     
     // Sharing & Collaboration
     { value: 'Share', label: 'Share', icon: Share },
     { value: 'Copy', label: 'Copy', icon: Copy },
     
     // Text & Typography
     { value: 'Type', label: 'Type', icon: Type },
     { value: 'Bold', label: 'Bold', icon: Bold },
     { value: 'Italic', label: 'Italic', icon: Italic },
     
     // Layout
     { value: 'List', label: 'List', icon: List },
     { value: 'Grid', label: 'Grid', icon: Grid },
     { value: 'Columns', label: 'Columns', icon: Columns },
     { value: 'Rows', label: 'Rows', icon: Rows },
     { value: 'Layout', label: 'Layout', icon: Layout },
     { value: 'Sidebar', label: 'Sidebar', icon: Sidebar },
     
     // View Controls
     { value: 'Maximize', label: 'Maximize', icon: Maximize },
     { value: 'Minimize', label: 'Minimize', icon: Minimize },
     { value: 'Move', label: 'Move', icon: Move },
     { value: 'ZoomIn', label: 'Zoom In', icon: ZoomIn },
     { value: 'ZoomOut', label: 'Zoom Out', icon: ZoomOut },
     
     // Refresh & Loading
     { value: 'RefreshCw', label: 'Refresh CW', icon: RefreshCw },
     { value: 'RefreshCcw', label: 'Refresh CCW', icon: RefreshCcw },
     
     // Media Playback
     { value: 'Shuffle', label: 'Shuffle', icon: Shuffle },
     
     // Notifications
     { value: 'Bell', label: 'Bell', icon: Bell },
     { value: 'BellOff', label: 'Bell Off', icon: BellOff },
     
     // Email
     { value: 'Inbox', label: 'Inbox', icon: Inbox },
     { value: 'Send', label: 'Send', icon: Send },
     { value: 'Reply', label: 'Reply', icon: Reply },
     
     // File Management
     { value: 'Archive', label: 'Archive', icon: Archive },
     { value: 'ArchiveX', label: 'Archive X', icon: ArchiveX },
     { value: 'Trash', label: 'Trash', icon: Trash },
     
     // Weather & Nature
     { value: 'CloudRain', label: 'Cloud Rain', icon: CloudRain },
     { value: 'Sun', label: 'Sun', icon: Sun },
     { value: 'Moon', label: 'Moon', icon: Moon },
     { value: 'Cloudy', label: 'Cloudy', icon: Cloudy },
     { value: 'Wind', label: 'Wind', icon: Wind },
     { value: 'Umbrella', label: 'Umbrella', icon: Umbrella },
     
     // Location & Navigation
     { value: 'Compass', label: 'Compass', icon: Compass },
     { value: 'Map', label: 'Map', icon: Map },
     { value: 'Flag', label: 'Flag', icon: Flag },
     
     // Achievements
     { value: 'Award', label: 'Award', icon: Award },
     { value: 'Trophy', label: 'Trophy', icon: Trophy },
     { value: 'Gift', label: 'Gift', icon: Gift },
     { value: 'Package', label: 'Package', icon: Package },
     
     // Shopping
     { value: 'ShoppingCart', label: 'Shopping Cart', icon: ShoppingCart },
     { value: 'ShoppingBag', label: 'Shopping Bag', icon: ShoppingBag },
     { value: 'Wallet', label: 'Wallet', icon: Wallet },
     
     // Emotions & Reactions
     { value: 'Smile', label: 'Smile', icon: Smile },
     { value: 'Frown', label: 'Frown', icon: Frown },
     { value: 'Meh', label: 'Meh', icon: Meh },
     { value: 'Laugh', label: 'Laugh', icon: Laugh },
     { value: 'Angry', label: 'Angry', icon: Angry },
     { value: 'ThumbsUp', label: 'Thumbs Up', icon: ThumbsUp },
     { value: 'ThumbsDown', label: 'Thumbs Down', icon: ThumbsDown },
     
     // Status Indicators
     { value: 'CheckCircle', label: 'Check Circle', icon: CheckCircle },
     { value: 'XCircle', label: 'X Circle', icon: XCircle },
     { value: 'MinusCircle', label: 'Minus Circle', icon: MinusCircle },
     { value: 'PlusCircle', label: 'Plus Circle', icon: PlusCircle },
     
     // Shapes & Symbols
     { value: 'Circle', label: 'Circle', icon: Circle },
     { value: 'Square', label: 'Square', icon: Square },
     { value: 'Triangle', label: 'Triangle', icon: Triangle },
     { value: 'Hexagon', label: 'Hexagon', icon: Hexagon },
     { value: 'Diamond', label: 'Diamond', icon: Diamond },
     { value: 'Cross', label: 'Cross', icon: Cross },
     { value: 'Hash', label: 'Hash', icon: Hash },
     { value: 'Percent', label: 'Percent', icon: Percent },
     { value: 'AtSign', label: 'At Sign', icon: AtSign },
   ];