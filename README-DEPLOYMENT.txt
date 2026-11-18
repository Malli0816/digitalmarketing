GROWTHPILOT DIGITAL MARKETING WEBSITE
=====================================

CONTENTS
--------
index.html                  Homepage
about.html                  About Us page
services.html               Services page
contact.html                Contact Us page
assets/css/style.css        Responsive styling, hover and scroll animations
assets/js/main.js           Mobile menu, scroll reveal, contact form behaviour
nginx/digital-marketing.conf Nginx virtual host configuration

IMPORTANT BEFORE DEPLOYMENT
---------------------------
1. This is a static HTML/CSS/JavaScript website. It runs on a Linux Azure VM with Nginx.
2. Replace "GrowthPilot" with your business name if required.
3. Replace hello@growthpilot.example in contact.html and footer links with your real email.
4. The contact form currently opens the visitor's email application using mailto.
   It does NOT save or send enquiries directly from the server. For production form
   submissions, connect a backend/API or a trusted form service.
5. Google Fonts are loaded from Google Fonts; an internet connection is needed for those fonts.
6. The website uses relative page links, so all four HTML pages should remain in the same folder.

AZURE LINUX VM DEPLOYMENT (UBUNTU)
----------------------------------
Connect to the VM from your computer:

    ssh -i /path/to/your-key.pem azureuser@YOUR_PUBLIC_IP

Update package lists:

    sudo apt update

Install Nginx:

    sudo apt install nginx unzip -y

Start Nginx and enable it after reboot:

    sudo systemctl enable --now nginx

Create the website directory:

    sudo mkdir -p /var/www/digital-marketing

Upload the ZIP from your local computer (run this on your LOCAL computer):

    scp -i /path/to/your-key.pem digital-marketing-website.zip azureuser@YOUR_PUBLIC_IP:/home/azureuser/

Back on the VM, extract the website:

    cd /home/azureuser
    unzip -o digital-marketing-website.zip -d digital-marketing-website
    sudo cp -r digital-marketing-website/index.html digital-marketing-website/about.html digital-marketing-website/services.html digital-marketing-website/contact.html digital-marketing-website/assets /var/www/digital-marketing/

Set permissions:

    sudo chown -R www-data:www-data /var/www/digital-marketing
    sudo find /var/www/digital-marketing -type d -exec chmod 755 {} \;
    sudo find /var/www/digital-marketing -type f -exec chmod 644 {} \;

Configure Nginx:

    sudo cp /home/azureuser/digital-marketing-website/nginx/digital-marketing.conf /etc/nginx/sites-available/digital-marketing
    sudo ln -sfn /etc/nginx/sites-available/digital-marketing /etc/nginx/sites-enabled/digital-marketing
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl reload nginx

AZURE NETWORK ACCESS
--------------------
In Azure Portal:
1. Open the Virtual Machine.
2. Go to Networking / Network settings.
3. Add an inbound security rule:
   Source: Any (or your required source range)
   Source port ranges: *
   Destination: Any
   Service: HTTP
   Destination port: 80
   Protocol: TCP
   Action: Allow
   Priority: choose an unused priority, for example 300
   Name: Allow-HTTP
4. Save the rule.

Open this in a browser:

    http://YOUR_PUBLIC_IP

You should see the homepage. Test the navigation links for About Us, Services and Contact.

OPTIONAL: HTTPS AND DOMAIN
--------------------------
For a production website, point your domain's DNS A record to the VM public IP, then
configure HTTPS with a trusted TLS certificate (for example, Let's Encrypt Certbot).
Do not expose SSH (port 22) to the whole internet if you can restrict it to your IP.

TROUBLESHOOTING
---------------
Check Nginx status:
    sudo systemctl status nginx

Validate Nginx configuration:
    sudo nginx -t

View website access log:
    sudo tail -f /var/log/nginx/digital-marketing-access.log

View Nginx error log:
    sudo tail -f /var/log/nginx/digital-marketing-error.log

Check files:
    ls -la /var/www/digital-marketing

If the site does not open, verify:
- The VM is running and has a Public IP.
- Azure NSG allows inbound TCP port 80.
- Nginx is active.
- The website files are in /var/www/digital-marketing.
- The Nginx configuration passes `sudo nginx -t`.

SECURITY NOTE
-------------
For a real public website, use HTTPS, keep the VM patched, restrict SSH access,
and configure backups/monitoring. This package is a frontend website, not a
complete server-side application.
