# MockUniversity Letter Display Integration Guide

## 🎯 Overview
This integration allows MockUniversity to receive and display actual recommendation letter content from StellarRec in a text box on the apply page, exactly as shown in the screenshot.

## 📄 Files Created/Updated

### New Netlify Functions:
1. **`netlify/functions/get-recommendation-data.js`** - Retrieves stored letter data
2. **`netlify/functions/reco-hook.js`** - Enhanced to handle letter content

### Updated Files:
3. **`apply.html`** - Added letter display text area and integration script
4. **`test-webhook.html`** - Enhanced testing capabilities

## 🔄 How It Works

### Step 1: StellarRec Sends Letter
- Recommender writes letter in StellarRec text editor
- Clicks "Send to Selected Universities"
- StellarRec sends letter content to MockUniversity webhook

### Step 2: MockUniversity Stores Letter
- `reco-hook.js` receives the letter content
- Stores in Netlify Blobs with `letter_content` field
- Associates with `external_id` for tracking

### Step 3: Apply Page Displays Letter
- Page loads with `?external_id=XXXX` parameter
- Integration script fetches letter data
- Displays in green-bordered text box
- Shows StellarRec branding and metadata

## 🎨 Visual Result

✅ **Green border** around text box  
📝 **Label**: "Recommendation Letter from [Name] via StellarRec"  
📅 **Date stamp** showing submission date  
🔒 **Read-only** to prevent accidental editing  
📊 **Character count** and status information

## 🚀 Deployment Steps

### 1. Upload Netlify Functions
Copy these files to MockUniversity's `netlify/functions/` folder:
- `reco-hook.js`
- `get-recommendation-data.js`

### 2. Update Apply Page
Replace the existing `apply.html` with the updated version that includes:
- Letter display text area
- Enhanced integration script
- Letter content rendering function

### 3. Set Environment Variables
In Netlify Dashboard → Site Settings → Environment Variables:
- `NETLIFY_BLOBS_TOKEN` (create in Netlify user settings)

### 4. Deploy and Test
- Commit and push changes
- Test using `test-webhook.html`
- Verify letter appears in green text box

## 🧪 Testing Instructions

### Complete Workflow Test:
1. Visit: `https://mockuniversity.netlify.app/test-webhook.html`
2. Click "Test Letter Display" button
3. Click "Open Apply Page with Live Tracking"
4. Verify letter appears in green text box

### StellarRec Integration Test:
1. Write letter in StellarRec recommender portal
2. Run `SR_MOCK.testLetterCapture()` in browser console
3. Click "Send to Selected Universities"
4. Click "View Mock University Status"
5. Verify letter content appears in MockUniversity

## 📋 Expected Results

When integration is working correctly:

### In MockUniversity Apply Page:
- ✅ Green-bordered text area appears
- ✅ Label: "📝 Recommendation Letter from Prof. Manas Mohan Nand via StellarRec"
- ✅ Meta info: Status, submission date, character count
- ✅ Full letter content displayed in text area
- ✅ Read-only formatting prevents editing

### In Browser Console:
- ✅ No JavaScript errors
- ✅ Successful API calls to `/get-recommendation-data`
- ✅ Letter content properly rendered

## 🔗 API Endpoints

### Webhook Endpoint (for StellarRec):
```
POST /.netlify/functions/reco-hook
Content-Type: application/json

{
  "external_id": "reco_12345",
  "student_name": "Student Name",
  "recommender_name": "Prof. Name",
  "recommender_email": "prof@university.edu",
  "status": "completed",
  "letter_content": "Dear Admissions Committee...",
  "letter_format": "text"
}
```

### Data Retrieval Endpoint:
```
GET /.netlify/functions/get-recommendation-data?external_id=reco_12345
```

## 🎉 Success Criteria

The integration is successful when:
1. ✅ Letter content appears in green text box
2. ✅ StellarRec branding is visible
3. ✅ Date and status information displayed
4. ✅ Text area is read-only
5. ✅ No JavaScript errors in console

## 🔧 Troubleshooting

### Letter Not Appearing:
- Check browser console for errors
- Verify `external_id` in URL
- Check Netlify function logs
- Ensure `NETLIFY_BLOBS_TOKEN` is set

### Styling Issues:
- Verify CSS is loading correctly
- Check for conflicting styles
- Ensure text area has green border

### API Errors:
- Check Netlify function deployment
- Verify environment variables
- Check CORS headers

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Test with `test-webhook.html`
3. Verify Netlify function logs
4. Ensure all files are properly deployed

The integration is now complete and ready for production use! 🚀