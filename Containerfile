#  UnrealIRCd server Containerfile
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

FROM alpine:latest

RUN apk add shadow bash build-base autoconf automake openssl-dev openssl curl-dev; \
	rm -rf /var/cache;

RUN useradd -MUK UMASK=002 -d / unreal;

WORKDIR /unrealircd-src

ADD --chown=unreal:unreal . .

# VOLUME /unrealircd/conf /unrealircd/data /unrealircd/logs /unrealircd

RUN mkdir /unrealircd; \
	chown unreal:unreal . /unrealircd;

USER unreal

ENV HOME=

# RUN ./Config

# if for some reason don't want to call Config (both seem to work)
RUN \
./autogen.sh && \
	./configure --with-showlistmodes --enable-ssl --enable-libcurl \
		--with-nick-history=2000 --with-permissions=0600 --enable-dynamic-linking \
		--disable-asan --enable-geoip_classic

# one of the certificates fail to create if it doesn't receive any input
# hence this line is necessary even if you run Config

RUN echo -e 'make pem\n\n\n\n\n\n' | bash -

RUN mkdir -p /unrealircd/tmp /unrealircd/conf/tls; \
	cp server.cert.pem server.key.pem server.req.pem /unrealircd/conf/tls

RUN make -j4; \
	make install;

RUN make clean;

WORKDIR /unrealircd

RUN cp -a /unrealircd-src/container/conf /unrealircd/; \
	/unrealircd-src/container/gen_cloak.sh

EXPOSE 6667 6697 6900

ENV ASAN_OPTIONS="abort_on_error=1:disable_coredump=0:unmap_shadow_on_exit=1:log_path=/unrealircd/tmp/unrealircd_asan:detect_leaks=0"

CMD /unrealircd/bin/unrealircd -F
