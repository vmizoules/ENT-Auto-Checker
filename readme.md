# ENT Auto Checker

Auto check of availables marks displayed on ENT and send mail when new mark appears!

## Requirements

Must have:

  - PhantomJS executable in `/opt/phantomjs`.
  - Python3 installed or mail command configured

## Configure

Change email addresses in scripts `run.sh` and `mail.py`.

Insert yours credentials at the top of `js/getMarks.js`.

Adapt urls if needed in the previous js script.

## Usage

Edit crontab with `crontab -e` to automatize script launch (every 20min in this example):

	*/20 * * * * /path-to-project/run.sh >>/path-to-project/marks.logs 2>>/path-to-project/marks_errors.logs

Logs output will be like:

	[INFO] No update... - Sat 29 Apr 02:20:01 CEST 2017 raspberrypi
	[INFO] No update... - Sat 29 Apr 02:40:01 CEST 2017 raspberrypi
	[INFO] No update... - Sat 29 Apr 03:00:01 CEST 2017 raspberrypi
	[INFO] Sending email... 2 differences - Sat 29 Apr 03:20:01 CEST 2017 raspberrypi

And you should receive an email with the diff and a summary with raw datas.

Enjoy!

## Credits

V. Mizoules
