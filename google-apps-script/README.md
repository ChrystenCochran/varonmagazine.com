# VÄRON application email backend

This backend accepts Model and Creative Collective applications from the website and emails them to **cc@varonmagazine.com**. Applicants submit on the site; no email app opens. Portfolio URL and image uploads are optional. Images are attached to the notification email (maximum 5 MB per image).

## Deploy once (Google Apps Script)

1. Sign in to the Google account that should own the application service.
2. Open https://script.google.com/home/start and create a new project named **VÄRON Applications**.
3. Replace the editor contents with `Code.gs` from this folder and save.
4. Select **Deploy → New deployment**.
5. Choose type **Web app**.
6. Set **Execute as: Me** and **Who has access: Anyone**. This is necessary so applicants can submit without signing into Google.
7. Click **Deploy**, authorize the requested permissions, and copy the Web app URL ending in `/exec`.

## Connect the website

In `assets/config.js`, replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with the copied URL. Commit/publish that change. The endpoint is public by design; it only accepts application submissions and sends them to the fixed recipient above.

## Test

Submit one Model test and one Creative test from https://varonmagazine.com/JoinVaron/. Confirm both arrive at **cc@varonmagazine.com**, with any selected images attached. The website displays a success message only after the Apps Script endpoint reports that the email was sent.

## Notes

- Google Apps Script sends mail from the Google account that owns the deployment; replies can be directed to the applicant's email if configured later.
- Keep each image at or below 5 MB. Multiple attachments must also fit Google's email message size limits.
- If you change Code.gs after deployment, use **Deploy → Manage deployments → Edit → New version → Deploy**.
