# GitHub Deployment Setup

## Setting Up GitHub Secrets

1. **Go to your GitHub repository**
   - Navigate to: `Settings` → `Secrets and variables` → `Actions`

2. **Add Repository Secrets**
   Click "New repository secret" and add these three secrets:

   **Secret 1:**
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyC1O5I8sdt9n0kUix5R6gMv9sPmB1RSFA4`

   **Secret 2:**
   - Name: `OPENWEATHERMAP_API_KEY`
   - Value: `b74c01ac989158152c0e93df14d15ba1`

   **Secret 3:**
   - Name: `EMAILJS_PUBLIC_KEY`
   - Value: `your_public_id` (replace with your actual EmailJS key)

3. **Enable GitHub Pages**
   - Go to `Settings` → `Pages`
   - Source: Deploy from a branch
   - Branch: `gh-pages` → `/ (root)` → Save

4. **Deploy**
   ```bash
   git add .
   git commit -m "Add GitHub Actions deployment"
   git push
   ```

The workflow will automatically:
- Create `config.js` with your secrets
- Deploy your site to GitHub Pages
- Exclude demos, implementations, docs folders

Your site will be live at: `https://yourusername.github.io/your-repo-name/`
