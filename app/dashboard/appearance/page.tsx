"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Type, 
  Layout, 
  Eye, 
  Save, 
  Plus, 
  Trash2, 
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";

interface AppearanceSettings {
  _id?: string;
  name: string;
  description: string;
  isActive: boolean;
  
  // Simplified Color System
  colorMain: string;      // Orange
  colorSecondary: string; // Purple
  colorBackground: string; // White
  colorBlack: string;     // Black
  colorWhite: string;     // White
  colorGray: string;      // Gray
  colorGreen: string;     // Green
  
  // Typography
  fontFamily: string;
  headingFontFamily: string;
  fontSize: string;
  headingFontSize: string;
  lineHeight: string;
  
  // Spacing & Effects
  borderRadius: string;
  spacing: string;
  shadowColor: string;
  shadowSize: string;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Nunito', label: 'Nunito' },
];

const defaultSettings: AppearanceSettings = {
  name: 'Default Theme',
  description: 'Default appearance settings',
  isActive: true,
  colorMain: '#ff5c35',      // Orange
  colorSecondary: '#714b67', // Purple
  colorBackground: '#ffffff', // White
  colorBlack: '#000000',     // Black
  colorWhite: '#ffffff',     // White
  colorGray: '#6b7280',      // Gray
  colorGreen: '#10b981',     // Green
  fontFamily: 'Inter',
  headingFontFamily: 'Inter',
  fontSize: '16px',
  headingFontSize: '24px',
  lineHeight: '1.5',
  borderRadius: '8px',
  spacing: '16px',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowSize: '4px',
};

export default function AppearancePage() {
  const [settings, setSettings] = useState<AppearanceSettings>(defaultSettings);
  const [themes, setThemes] = useState<AppearanceSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const { refreshTheme } = useTheme();

  useEffect(() => {
    fetchThemes();
  }, []);

  // Ensure settings are synchronized with the active theme
  useEffect(() => {
    if (themes.length > 0) {
      const activeTheme = themes.find((theme: AppearanceSettings) => theme.isActive);
      if (activeTheme && activeTheme._id !== settings._id) {
        setSettings(activeTheme);
      }
    }
  }, [themes, settings._id]);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/appearance');
      const data = await response.json();
      
      // Ensure all themes have the brand color fields with defaults
      const processedThemes = data.map((theme: AppearanceSettings) => ({
        ...theme,
      }));
      
      setThemes(processedThemes);
      
      // Set the active theme as current settings
      const activeTheme = processedThemes.find((theme: AppearanceSettings) => theme.isActive);
      if (activeTheme) {
        setSettings(activeTheme);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error('Failed to load themes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = settings._id ? 'PUT' : 'POST';
      const url = settings._id ? `/api/appearance/${settings._id}` : '/api/appearance';
      
      console.log('Saving settings:', settings);
      console.log('Typography fields:', {
        fontFamily: settings.fontFamily,
        headingFontFamily: settings.headingFontFamily,
        fontSize: settings.fontSize,
        headingFontSize: settings.headingFontSize,
        lineHeight: settings.lineHeight
      });
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save');

      const savedSettings = await response.json();
      console.log('Saved settings response:', savedSettings);
      
      // Force a complete state update by creating a new object
      const updatedSettings = { ...savedSettings };
      setSettings(updatedSettings);
      
      // Update themes array with the latest saved values
      setThemes((prevThemes) => {
        const updatedThemes = prevThemes.map((theme) => 
          theme._id === updatedSettings._id ? updatedSettings : theme
        );
        // If it's a new theme, add it to the array
        if (!prevThemes.find(theme => theme._id === updatedSettings._id)) {
          updatedThemes.push(updatedSettings);
        }
        return updatedThemes;
      });
      
      refreshTheme();
      toast.success('Theme saved successfully!');
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const duplicatedSettings = {
        ...settings,
        _id: undefined,
        name: `${settings.name} (Copy)`,
        isActive: false,
      };
      
      const response = await fetch('/api/appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedSettings),
      });

      if (!response.ok) throw new Error('Failed to duplicate theme');

      const newTheme = await response.json();
      
      // Add the new theme to the themes array
      setThemes((prevThemes) => [...prevThemes, newTheme]);
      
      // Set the new theme as current settings
      setSettings(newTheme);
      
      toast.success('Theme duplicated successfully!');
    } catch (error) {
      console.error('Error duplicating theme:', error);
      toast.error('Failed to duplicate theme');
    }
  };

  const handleDelete = async () => {
    if (!settings._id) return;
    
    if (!confirm('Are you sure you want to delete this theme?')) return;
    
    try {
      const response = await fetch(`/api/appearance/${settings._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      // Remove the deleted theme from the themes array
      setThemes((prevThemes) => 
        prevThemes.filter((theme) => theme._id !== settings._id)
      );
      
      // Set to default settings if the deleted theme was active
      if (settings.isActive) {
        setSettings(defaultSettings);
      }
      
      refreshTheme();
      toast.success('Theme deleted successfully!');
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast.error('Failed to delete theme');
    }
  };

  const handleActivate = async (theme: AppearanceSettings) => {
    try {
      const response = await fetch(`/api/appearance/${theme._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...theme, isActive: true }),
      });

      if (!response.ok) throw new Error('Failed to activate');

      const activatedTheme = await response.json();
      
      // Update themes array with the activated theme
      setThemes((prevThemes) => 
        prevThemes.map((t) => ({
          ...t,
          isActive: t._id === activatedTheme._id
        }))
      );
      
      refreshTheme();
      toast.success('Theme activated successfully!');
    } catch (error) {
      console.error('Error activating theme:', error);
      toast.error('Failed to activate theme');
    }
  };

  const copyCSS = () => {
    const css = generateCSS(settings);
    navigator.clipboard.writeText(css);
    setCopied(true);
    toast.success('CSS copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCSS = (appearance: AppearanceSettings) => {
    return `:root {
  /* Simplified Color System */
  --color-main: ${appearance.colorMain};           /* Orange */
  --color-secondary: ${appearance.colorSecondary}; /* Purple */
  --color-background: ${appearance.colorBackground}; /* White */
  --color-black: ${appearance.colorBlack};         /* Black */
  --color-white: ${appearance.colorWhite};         /* White */
  --color-gray: ${appearance.colorGray};           /* Gray */
  --color-green: ${appearance.colorGreen};         /* Green */
  
  /* Typography */
  --font-family: ${appearance.fontFamily}, sans-serif;
  --heading-font-family: ${appearance.headingFontFamily}, sans-serif;
  --font-size: ${appearance.fontSize};
  --heading-font-size: ${appearance.headingFontSize};
  --line-height: ${appearance.lineHeight};
  
  /* Spacing & Effects */
  --border-radius: ${appearance.borderRadius};
  --spacing: ${appearance.spacing};
  --shadow-color: ${appearance.shadowColor};
  --shadow-size: ${appearance.shadowSize};
}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-color-gray">Loading appearance settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-color-black">Appearance Settings</h1>
          <p className="text-sm sm:text-base text-color-gray mt-1">
            Customize colors, fonts, and design elements for your website
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Theme'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Management */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  placeholder="Enter theme name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="theme-description">Description</Label>
                <Input
                  id="theme-description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  placeholder="Enter theme description"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="active-theme">Active Theme</Label>
                <Switch
                  id="active-theme"
                  checked={settings.isActive}
                  onCheckedChange={(checked) => setSettings({ ...settings, isActive: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Available Themes</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Array.isArray(themes) && themes.map((theme) => (
                    <div
                      key={theme._id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        theme._id === settings._id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSettings({ ...theme })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{theme.name}</p>
                          <p className="text-xs text-color-gray">{theme.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {theme.isActive && (
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivate(theme);
                            }}
                            disabled={theme.isActive}
                          >
                            {theme.isActive ? 'Active' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleDuplicate}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                {settings._id && (
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="colors" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="spacing">Spacing</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Color Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="color-main">Main Color (--color-main)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color-main"
                          type="color"
                          value={settings.colorMain}
                          onChange={(e) => setSettings({ ...settings, colorMain: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.colorMain}
                          onChange={(e) => setSettings({ ...settings, colorMain: e.target.value })}
                          placeholder="#ff5c35"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color-secondary">Secondary Color (--color-secondary)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color-secondary"
                          type="color"
                          value={settings.colorSecondary}
                          onChange={(e) => setSettings({ ...settings, colorSecondary: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.colorSecondary}
                          onChange={(e) => setSettings({ ...settings, colorSecondary: e.target.value })}
                          placeholder="#714b67"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color-background">Background Color (--color-background)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color-background"
                          type="color"
                          value={settings.colorBackground}
                          onChange={(e) => setSettings({ ...settings, colorBackground: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.colorBackground}
                          onChange={(e) => setSettings({ ...settings, colorBackground: e.target.value })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color-black">Black (--color-black)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color-black"
                          type="color"
                          value={settings.colorBlack}
                          onChange={(e) => setSettings({ ...settings, colorBlack: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.colorBlack}
                          onChange={(e) => setSettings({ ...settings, colorBlack: e.target.value })}
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color-white">White (--color-white)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color-white"
                          type="color"
                          value={settings.colorWhite}
                          onChange={(e) => setSettings({ ...settings, colorWhite: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.colorWhite}
                          onChange={(e) => setSettings({ ...settings, colorWhite: e.target.value })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color-gray">Gray (--color-gray)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color-gray"
                          type="color"
                          value={settings.colorGray}
                          onChange={(e) => setSettings({ ...settings, colorGray: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.colorGray}
                          onChange={(e) => setSettings({ ...settings, colorGray: e.target.value })}
                          placeholder="#6b7280"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color-green">Green (--color-green)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color-green"
                          type="color"
                          value={settings.colorGreen}
                          onChange={(e) => setSettings({ ...settings, colorGreen: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.colorGreen}
                          onChange={(e) => setSettings({ ...settings, colorGreen: e.target.value })}
                          placeholder="#10b981"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Typography Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="font-family">Body Font</Label>
                      <Select
                        value={settings.fontFamily}
                        onValueChange={(value) => setSettings({ ...settings, fontFamily: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="heading-font-family">Heading Font</Label>
                      <Select
                        value={settings.headingFontFamily}
                        onValueChange={(value) => setSettings({ ...settings, headingFontFamily: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="font-size">Base Font Size</Label>
                      <Input
                        id="font-size"
                        value={settings.fontSize}
                        onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                        placeholder="16px"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="heading-font-size">Heading Font Size</Label>
                      <Input
                        id="heading-font-size"
                        value={settings.headingFontSize}
                        onChange={(e) => setSettings({ ...settings, headingFontSize: e.target.value })}
                        placeholder="24px"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="line-height">Line Height</Label>
                      <Input
                        id="line-height"
                        value={settings.lineHeight}
                        onChange={(e) => setSettings({ ...settings, lineHeight: e.target.value })}
                        placeholder="1.5"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spacing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spacing & Effects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="border-radius">Border Radius</Label>
                      <Input
                        id="border-radius"
                        value={settings.borderRadius}
                        onChange={(e) => setSettings({ ...settings, borderRadius: e.target.value })}
                        placeholder="8px"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spacing">Base Spacing</Label>
                      <Input
                        id="spacing"
                        value={settings.spacing}
                        onChange={(e) => setSettings({ ...settings, spacing: e.target.value })}
                        placeholder="16px"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shadow-color">Shadow Color</Label>
                      <Input
                        id="shadow-color"
                        value={settings.shadowColor}
                        onChange={(e) => setSettings({ ...settings, shadowColor: e.target.value })}
                        placeholder="rgba(0, 0, 0, 0.1)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shadow-size">Shadow Size</Label>
                      <Input
                        id="shadow-size"
                        value={settings.shadowSize}
                        onChange={(e) => setSettings({ ...settings, shadowSize: e.target.value })}
                        placeholder="4px"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="css" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Generated CSS
                    <Button
                      variant="outline"
                      onClick={copyCSS}
                      className="flex items-center gap-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy CSS'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{generateCSS(settings)}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Preview */}
      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              style={{
                backgroundColor: settings.colorBackground,
                color: settings.colorBlack,
                fontFamily: `${settings.fontFamily}, sans-serif`,
                fontSize: settings.fontSize,
                lineHeight: settings.lineHeight,
              }}
              className="p-6 rounded-lg border"
            >
              <h1
                style={{
                  fontFamily: `${settings.headingFontFamily}, sans-serif`,
                  fontSize: settings.headingFontSize,
                  color: settings.colorBlack,
                }}
                className="mb-4"
              >
                Sample Heading
              </h1>
              <p style={{ color: settings.colorGray }} className="mb-4">
                This is a sample paragraph with secondary text color. It demonstrates how your typography and color choices will look on your website.
              </p>
              <div className="flex gap-4">
                <Button
                  style={{
                    backgroundColor: settings.colorMain,
                    borderRadius: settings.borderRadius,
                  }}
                >
                  Primary Button
                </Button>
                <Button
                  variant="outline"
                  style={{
                    borderColor: settings.colorSecondary,
                    color: settings.colorSecondary,
                    borderRadius: settings.borderRadius,
                  }}
                >
                  Secondary Button
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 