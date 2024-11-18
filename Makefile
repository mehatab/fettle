SECRET_PATH ?= 'secret/scs/github/pat'
SECRET_TEMPFILE ?= './.secrets'
secrets: 
	mkdir -p ./.secrets
	set -e; for i in s3df-status-pusher; do vault kv get --field=$$i $(SECRET_PATH) > $(SECRET_TEMPFILE)/$$i ; done

clean-secrets:
	rm -rf $(SECRET_TEMPFILE)
    
