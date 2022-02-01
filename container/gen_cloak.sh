#!/bin/sh
#
#  deploy script for the UnrealIRCd container
#
#  (C) 2022 Raphael Bertoche
#
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 1, or (at your option)
#  any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
#

if [ "$#" -eq 1 ]; then
	FILE="$1"
elif [ "$#" -eq 0 ]; then
	FILE="$HOME/unrealircd/conf/unrealircd.conf"
else
	echo "usage: $0 [configfile]"
	exit 1
fi

TMP_FILE=`mktemp`

gen_cloak (){
	for i in $(seq 1 3); do
		printf "\t\t\""
		tr -dc _A-Z-a-z-0-9 < /dev/urandom | head -c${1:-80}
		echo '";'
	done
}

gen_cloak > $TMP_FILE

sed -i "$FILE" -e '/${CLOAK_KEYS}/r '"$TMP_FILE" -e '/${CLOAK_KEYS}/d'

rm $TMP_FILE


