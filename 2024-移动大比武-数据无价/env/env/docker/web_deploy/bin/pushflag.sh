#! /bin/bash
#flag在数据库中
sleep 3
mysql -uroot -pa1d2m3i4n857 <<EOF
USE health_check_system;
UPDATE users SET id_card = '$1',address = '$1',phone = '$1',password = '$1',healthy_Report = '$1' WHERE name = 'flag';
EOF
