import os
import sys
import subprocess
from ftplib import FTP
import argparse
from pathlib import Path
import shutil

def run_command(command, cwd=None):
    """Run a shell command and return its output."""
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {command}")
        print(f"Error: {e.stderr}")
        sys.exit(1)

def build_react_app():
    """Build the React application."""
    print("Installing dependencies...")
    run_command("yarn install")
    
    print("Building application...")
    run_command("NODE_OPTIONS=--openssl-legacy-provider yarn build")
    
    print("Build completed successfully!")

def deploy_to_ftp(host, username, password, local_dir, remote_dir):
    """Deploy the built files to FTP server."""
    print(f"Connecting to FTP server: {host}")
    
    try:
        # Connect to FTP server
        ftp = FTP(host)
        ftp.login(username, password)
        
        # Change to remote directory
        ftp.cwd(remote_dir)
        
        # Clear existing files
        print("Clearing existing files...")
        for filename in ftp.nlst():
            try:
                ftp.delete(filename)
            except:
                # If it's a directory, try to remove it
                try:
                    ftp.rmd(filename)
                except:
                    pass
        
        # Upload new files
        print("Uploading new files...")
        local_build_dir = Path(local_dir) / "build"
        
        def upload_directory(path):
            for item in path.iterdir():
                if item.is_file():
                    print(f"Uploading: {item.name}")
                    with open(item, 'rb') as f:
                        ftp.storbinary(f'STOR {item.name}', f)
                elif item.is_dir():
                    try:
                        ftp.mkd(item.name)
                    except:
                        pass
                    ftp.cwd(item.name)
                    upload_directory(item)
                    ftp.cwd('..')
        
        upload_directory(local_build_dir)
        
        print("Deployment completed successfully!")
        
    except Exception as e:
        print(f"FTP Error: {str(e)}")
        sys.exit(1)
    finally:
        try:
            ftp.quit()
        except:
            pass

def main():
    parser = argparse.ArgumentParser(description='Build and deploy React app to FTP')
    parser.add_argument('--host', required=True, help='FTP host')
    parser.add_argument('--username', required=True, help='FTP username')
    parser.add_argument('--password', required=True, help='FTP password')
    parser.add_argument('--local-dir', default='.', help='Local directory containing the React app')
    parser.add_argument('--remote-dir', default='/public_html', help='Remote directory on FTP server')
    
    args = parser.parse_args()
    
    # Change to the local directory
    os.chdir(args.local_dir)
    
    # Build the React app
    build_react_app()
    
    # Deploy to FTP
    deploy_to_ftp(
        args.host,
        args.username,
        args.password,
        args.local_dir,
        args.remote_dir
    )

if __name__ == "__main__":
    main() 