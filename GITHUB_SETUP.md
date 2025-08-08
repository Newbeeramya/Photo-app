# GitHub Pages Deployment Instructions

## Step 1: Create GitHub Repository
1. Go to https://github.com and sign in
2. Click "New repository" (green button)
3. Repository name: `simple-photo-app`
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README
6. Click "Create repository"

## Step 2: Connect Local Code to GitHub
Replace `YOUR_USERNAME` with your actual GitHub username in the commands below:

```bash
# Set the remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/simple-photo-app.git

# Update package.json homepage (replace YOUR_USERNAME)
# Edit package.json and change:
# "homepage": "https://YOUR_USERNAME.github.io/simple-photo-app"

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to GitHub Pages
```bash
# Deploy your app to GitHub Pages
npm run deploy
```

## Step 4: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll to "Pages" section
4. Source: "Deploy from a branch"
5. Branch: "gh-pages"
6. Folder: "/ (root)"
7. Click "Save"

## Your Live URL
After deployment, your app will be live at:
`https://YOUR_USERNAME.github.io/simple-photo-app`

## Notes
- First deployment may take 5-10 minutes to go live
- Future updates: just run `npm run deploy`
- Your app will automatically update when you push changes
