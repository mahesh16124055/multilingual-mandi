#!/usr/bin/env node

/**
 * Git Setup Helper Script
 * Helps you initialize Git and push to GitHub
 */

const { execSync } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

function runCommand(command, description) {
  try {
    console.log(`\n🔄 ${description}...`)
    execSync(command, { stdio: 'inherit' })
    console.log(`✅ ${description} completed`)
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message)
    throw error
  }
}

async function setupGit() {
  console.log('🚀 Multilingual Mandi - Git Setup Helper\n')
  
  try {
    // Check if git is initialized
    try {
      execSync('git status', { stdio: 'pipe' })
      console.log('✅ Git repository already initialized')
    } catch (error) {
      console.log('📁 Initializing Git repository...')
      runCommand('git init', 'Initialize Git repository')
    }
    
    // Check if there are any commits
    let hasCommits = false
    try {
      execSync('git log --oneline -1', { stdio: 'pipe' })
      hasCommits = true
    } catch (error) {
      hasCommits = false
    }
    
    if (!hasCommits) {
      console.log('\n📝 Setting up initial commit...')
      
      // Add all files
      runCommand('git add .', 'Add all files to Git')
      
      // Create initial commit
      runCommand('git commit -m "Initial commit: Multilingual Mandi - AI-powered agricultural marketplace"', 'Create initial commit')
      
      console.log('✅ Initial commit created successfully!')
    } else {
      console.log('✅ Repository already has commits')
      
      // Check for uncommitted changes
      try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' })
        if (status.trim()) {
          console.log('\n📝 Found uncommitted changes. Committing them...')
          runCommand('git add .', 'Add changed files')
          runCommand('git commit -m "Update: Latest changes to Multilingual Mandi"', 'Commit changes')
        }
      } catch (error) {
        console.log('ℹ️  No changes to commit')
      }
    }
    
    // Check if remote origin exists
    let hasRemote = false
    try {
      execSync('git remote get-url origin', { stdio: 'pipe' })
      hasRemote = true
      console.log('✅ Remote origin already configured')
    } catch (error) {
      hasRemote = false
    }
    
    if (!hasRemote) {
      console.log('\n🌐 Setting up GitHub repository...')
      console.log('📋 Steps to create GitHub repository:')
      console.log('1. Go to https://github.com/new')
      console.log('2. Repository name: multilingual-mandi')
      console.log('3. Description: AI-powered multilingual agricultural marketplace for Viksit Bharat 2047')
      console.log('4. Make it Public (recommended for portfolio)')
      console.log('5. DO NOT initialize with README (we already have one)')
      console.log('6. Click "Create repository"')
      
      const repoUrl = await question('\n🔗 Enter your GitHub repository URL (e.g., https://github.com/username/multilingual-mandi.git): ')
      
      if (repoUrl.trim()) {
        runCommand(`git remote add origin ${repoUrl.trim()}`, 'Add remote origin')
        runCommand('git branch -M main', 'Set main branch')
        runCommand('git push -u origin main', 'Push to GitHub')
        
        console.log('\n🎉 SUCCESS! Your Multilingual Mandi is now on GitHub!')
        console.log(`📱 Repository URL: ${repoUrl.trim().replace('.git', '')}`)
      } else {
        console.log('⚠️  No repository URL provided. You can add it later with:')
        console.log('   git remote add origin <your-repo-url>')
        console.log('   git push -u origin main')
      }
    } else {
      // Push existing repository
      console.log('\n📤 Pushing to existing repository...')
      try {
        runCommand('git push', 'Push to GitHub')
        console.log('✅ Successfully pushed to GitHub!')
      } catch (error) {
        console.log('⚠️  Push failed. You might need to pull first:')
        console.log('   git pull origin main')
        console.log('   git push')
      }
    }
    
    // Show repository info
    try {
      const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()
      const repoWebUrl = remoteUrl.replace('.git', '').replace('git@github.com:', 'https://github.com/')
      
      console.log('\n' + '='.repeat(60))
      console.log('🎯 REPOSITORY SETUP COMPLETE!')
      console.log('='.repeat(60))
      console.log(`📱 GitHub URL: ${repoWebUrl}`)
      console.log(`🔗 Clone URL: ${remoteUrl}`)
      console.log('\n📋 Next Steps:')
      console.log('1. Visit your GitHub repository')
      console.log('2. Add a description and topics')
      console.log('3. Enable GitHub Pages (optional)')
      console.log('4. Set up deployment (see HOSTING_GUIDE.md)')
      console.log('\n🚀 Ready to deploy your Multilingual Mandi!')
      console.log('='.repeat(60))
    } catch (error) {
      console.log('\n✅ Git setup completed successfully!')
    }
    
  } catch (error) {
    console.log('\n❌ Setup failed:', error.message)
    console.log('\n🔧 Manual setup commands:')
    console.log('git init')
    console.log('git add .')
    console.log('git commit -m "Initial commit"')
    console.log('git remote add origin <your-repo-url>')
    console.log('git push -u origin main')
  }
  
  rl.close()
}

// Run the setup
setupGit().catch(error => {
  console.error('❌ Setup failed:', error.message)
  rl.close()
  process.exit(1)
})