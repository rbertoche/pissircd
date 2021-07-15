/*
 *   IRC - Internet Relay Chat, src/modules/third/pissnet_relink.c
 *   (C) 2021 Polsaker - All rights reserved.
 *
 *   You are granted unlimited and unrestricted rights to use, modify 
 *   and redistribute the licensed work, pursuant to the following terms:
 *   1. You must piss
 *   2. You are required to say "Fuck You MemoServ/Noisytoot" in #opers on pissnet.
 */

#include "unrealircd.h"

ModuleHeader MOD_HEADER
  = {
	"third/noglobalmsg",
	"1.0",
	"Disables PRIVMSG $*",
	"Polsaker",
	"unrealircd-5",
    };


CMD_OVERRIDE_FUNC(override_privmsg);

MOD_INIT()
{
	return MOD_SUCCESS;
}

MOD_LOAD()
{
	if (!CommandOverrideAdd(modinfo->handle, "PRIVMSG", override_privmsg))
		return MOD_FAILED;


	return MOD_SUCCESS;
}

MOD_UNLOAD()
{
	return MOD_SUCCESS;
}

CMD_OVERRIDE_FUNC(override_privmsg)
{
	char *targetstr, *p;
	for (p = NULL, targetstr = strtoken(&p, parv[1], ","); targetstr; targetstr = strtoken(&p, NULL, ","))
	{
		if (*targetstr == '$')
		{
			sendnumeric(client, ERR_YOUREBANNEDCREEP, "Why would you want to do that?!");
			return;
		}
	}
	CallCommandOverride(ovr, client, recv_mtags, parc, parv);
}
