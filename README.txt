EECS 395 - Innovation and Technology in Journalism
Northwestern University

Team CommenTeam:
* Derek Morris
* Khalid Aziz
* Kate Springer
* Kevin Sue

PROJECT:
PHP code to generate an aggregated comment page for websites using Disqus. The project is aimed at the WBEZ.org, which uses a Drupal CMS.

SOFTWARE USED:
Drupal6
PHP 5.3.3
Disqus API 3.0
Disqus API PHP class (from https://github.com/disqus/disqus-php)

INSTALLATION PROCEDURE:
(assumes prior installation of drupal6, its dependencies, and the disqus module)
1. Download Project
2. Copy Disqus API into the location of your server
3. Open the text file containing the PHP code
4. Edit the value of the $secret_key variable to hold the secret key for your disqus forum
5. Create a new page in your drupal6 installation, and copy paste the PHP code as the content
6. Mark the content as PHP code
7. Press submit
