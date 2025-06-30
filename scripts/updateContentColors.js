const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define Content schema (simplified for this script)
const ContentSchema = new mongoose.Schema({
  type: String,
  title: String,
  description: String,
  content: mongoose.Schema.Types.Mixed,
  isActive: Boolean,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: Date,
  updatedAt: Date
});

const Content = mongoose.model('Content', ContentSchema);

async function updateContentColors() {
  try {
    console.log('🔄 Starting content color update...');

    // Get all content
    const allContent = await Content.find({});
    console.log(`📄 Found ${allContent.length} content items to update`);

    let updatedCount = 0;

    for (const content of allContent) {
      let needsUpdate = false;
      let updatedContent = { ...content.toObject() };

      // Function to recursively update color variables in any object
      function updateColorVariables(obj) {
        if (typeof obj === 'string') {
          let updated = obj;
          
          // Replace old color variables with new ones
          updated = updated.replace(/var\(--brand-main\)/g, 'var(--color-main)');
          updated = updated.replace(/var\(--brand-accent\)/g, 'var(--color-secondary)');
          updated = updated.replace(/var\(--text-secondary\)/g, 'var(--color-gray)');
          updated = updated.replace(/var\(--text-primary\)/g, 'var(--color-black)');
          updated = updated.replace(/var\(--background-color\)/g, 'var(--color-background)');
          
          if (updated !== obj) {
            needsUpdate = true;
            return updated;
          }
        } else if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            return obj.map(item => updateColorVariables(item));
          } else {
            const updated = {};
            for (const [key, value] of Object.entries(obj)) {
              updated[key] = updateColorVariables(value);
            }
            return updated;
          }
        }
        return obj;
      }

      // Update the content field
      if (content.content) {
        updatedContent.content = updateColorVariables(content.content);
      }

      // Update the description field
      if (content.description) {
        updatedContent.description = updateColorVariables(content.description);
      }

      // Update the title field
      if (content.title) {
        updatedContent.title = updateColorVariables(content.title);
      }

      // Save if changes were made
      if (needsUpdate) {
        await Content.findByIdAndUpdate(content._id, {
          ...updatedContent,
          updatedAt: new Date()
        });
        updatedCount++;
        console.log(`✅ Updated content: ${content.title || content.type}`);
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} content items!`);
    console.log('\n📋 Color variable mapping:');
    console.log('- var(--brand-main) → var(--color-main)');
    console.log('- var(--brand-accent) → var(--color-secondary)');
    console.log('- var(--text-secondary) → var(--color-gray)');
    console.log('- var(--text-primary) → var(--color-black)');
    console.log('- var(--background-color) → var(--color-background)');

  } catch (error) {
    console.error('❌ Error updating content colors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the update
updateContentColors(); 