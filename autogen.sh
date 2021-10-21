#!/bin/bash
echo "Regenerating 'configure' and headers..."
echo "NOTE: If you are not an UnrealIRCd developers you might want to run ./Config"

cd "$(dirname "${0}")"

ACLOCAL_AMFLAGS=(-I autoconf/m4)

aclocal "${ACLOCAL_AMFLAGS[@]}"
autoconf
autoheader
