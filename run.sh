#!/bin/sh

date=`date`
host=`hostname`

# cd in script dir
cd "$(dirname "$0")"
 
# get marks and save output in "latest.txt"
cd js
/opt/phantomjs getMarks.js > ../datas/latest_tmp.txt

# test if getmarks script doesn't work
if test $? -ne 0
then
	(>&2 echo "[ERROR] Cannot get marks - $date $host")
	exit 255
fi
# reformat datas
cd ../datas
cat latest_tmp.txt | cut -b 10- | tr -cd 'éè[:print:]\n' > latest.txt

# check if it's initialization (first launch)
cd ../datas
if ! test -f current.txt
then
	cp latest.txt current.txt
fi

# now let's see difference !
diff latest.txt current.txt > diff.txt
nbDifference=`cat diff.txt | wc -l`

if test $nbDifference -gt 1
then
	echo "[INFO] Sending email... $nbDifference differences - $date $host"
	# prepare mail
	echo "----- DIFF -----" > email.txt
	cat diff.txt >> email.txt
	echo "" >> email.txt
	echo "" >> email.txt
	echo "----- RAW FILE -----" >> email.txt
	cat latest.txt >> email.txt
	# send mail (two ways to do it)
	#cat email.txt | mail -s "[ISIMA][ENT] Nouvelle note dispo !" your@email.com #if mail command available
	cat email.txt | python ../python/mail.py #if you want to use your own smtp
	# remove email file
	rm email.txt
	# update current
	cp latest.txt current.txt
else
	echo "[INFO] No update... - $date $host"
fi

rm diff.txt

exit 0
