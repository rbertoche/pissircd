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

if command -v podman; then
	PODMAN=podman
elif command -v docker; then
	PODMAN=docker
else
	echo "Install podman or something similar"
	exit 1
fi

$PODMAN build -t unrealircd . \
	&& $PODMAN run -it -p 6667:6667 -p 6697:6697 -p 6900:6900 unrealircd

