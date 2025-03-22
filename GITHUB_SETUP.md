# Connecting to GitHub

Follow these steps to connect your local repository to GitHub:

## 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click on the "+" icon in the top right corner and select "New repository"
3. Enter "busboyPOS" as the repository name
4. Add a description (optional)
5. Choose whether the repository should be public or private
6. DO NOT initialize the repository with a README, .gitignore, or license as we already have these files
7. Click "Create repository"

## 2. Connect Your Local Repository to GitHub

After creating the repository, GitHub will display a page with instructions. Use the following commands to connect your local repository to GitHub:

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/busboyPOS.git
git push -u origin main
```

## 3. Verify the Connection

To verify that your local repository is connected to GitHub:

```bash
git remote -v
```

This should display:

```
origin  https://github.com/YOUR_USERNAME/busboyPOS.git (fetch)
origin  https://github.com/YOUR_USERNAME/busboyPOS.git (push)
```

## 4. Working with Branches

Create a development branch:

```bash
git checkout -b develop
git push -u origin develop
```

## 5. Protect Your Main Branch

On GitHub:

1. Go to your repository
2. Click on "Settings" > "Branches"
3. Under "Branch protection rules", click "Add rule"
4. Enter "main" as the branch name pattern
5. Check "Require pull request reviews before merging"
6. Check "Require status checks to pass before merging"
7. Click "Create"

## 6. Setting Up GitHub Pages (Optional)

If you want to set up a project website:

1. Go to your repository
2. Click on "Settings" > "Pages"
3. Under "Source", select "main" as the branch and "/docs" as the folder
4. Click "Save"

Your project website will be available at `https://YOUR_USERNAME.github.io/busboyPOS/` 