#!/bin/bash

# Define paths and directories
BASE_DIR="./pki"
CA_DIR="${BASE_DIR}/ca"
CERTS_DIR="${BASE_DIR}/certs"
CRL_DIR="${BASE_DIR}/crl"
NEWCERTS_DIR="${BASE_DIR}/newcerts"
PRIVATE_DIR="${BASE_DIR}/private"
USERS_DIR="${BASE_DIR}/users"
INDEX_FILE="${BASE_DIR}/index.txt"
SERIAL_FILE="${BASE_DIR}/serial"
CRL_FILE="${CRL_DIR}/ca.crl"
OPENSSL_CONFIG="${BASE_DIR}/openssl.cnf"

# Create directories and initialize files
mkdir -p ${CA_DIR} ${CERTS_DIR} ${CRL_DIR} ${NEWCERTS_DIR} ${PRIVATE_DIR} ${USERS_DIR}
touch ${INDEX_FILE}
echo 1000 > ${SERIAL_FILE}

# Create OpenSSL configuration
cat > ${OPENSSL_CONFIG} <<EOL
[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = ${BASE_DIR}
certs             = ${CERTS_DIR}
crl_dir           = ${CRL_DIR}
new_certs_dir     = ${NEWCERTS_DIR}
database          = ${INDEX_FILE}
serial            = ${SERIAL_FILE}
private_key       = ${PRIVATE_DIR}/ca.key
certificate       = ${CA_DIR}/ca.crt
default_md        = sha256
policy            = policy_anything
default_days      = 365
x509_extensions   = usr_cert
crlnumber         = ${BASE_DIR}/crlnumber
crl               = ${CRL_FILE}

[ policy_anything ]
countryName            = optional
stateOrProvinceName    = optional
localityName           = optional
organizationName       = optional
organizationalUnitName = optional
commonName             = supplied
emailAddress           = optional

[ usr_cert ]
basicConstraints=CA:FALSE
nsCertType = client, email
nsComment = "OpenSSL Generated Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
keyUsage = critical, nonRepudiation, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth, emailProtection

EOL

# Step 1: Initialize CA
initialize_pki() {
    echo "Creating CA private key and self-signed certificate..."
    openssl genrsa -out ${PRIVATE_DIR}/ca.key 4096
    openssl req -x509 -new -nodes -key ${PRIVATE_DIR}/ca.key -sha256 -days 3650 \
        -out ${CA_DIR}/ca.crt -subj "/C=US/ST=State/L=City/O=Organization/CN=RootCA"
    echo "CA initialization complete."
}

# Step 2: Create and Sign User Certificate
create_user_certificate() {
    read -p "Enter username: " USER_NAME
    USER_KEY="${USERS_DIR}/${USER_NAME}.key"
    USER_CSR="${USERS_DIR}/${USER_NAME}.csr"
    USER_CERT="${USERS_DIR}/${USER_NAME}.crt" # Temporarily store in user directory
    FINAL_CERT="${CERTS_DIR}/${USER_NAME}.crt" # Final location for certificate

    echo "Generating private key for ${USER_NAME}..."
    openssl genrsa -out ${USER_KEY} 2048

    echo "Creating CSR for ${USER_NAME}..."
    openssl req -new -key ${USER_KEY} -out ${USER_CSR} \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=${USER_NAME}"

    echo "Signing certificate for ${USER_NAME}..."
    openssl ca -batch -config ${OPENSSL_CONFIG} -extensions usr_cert -in ${USER_CSR} -out ${USER_CERT}

    if [ -f ${USER_CERT} ]; then
        echo "Moving signed certificate to ${CERTS_DIR}..."
        mv ${USER_CERT} ${FINAL_CERT}
        echo "User certificate created: ${FINAL_CERT}"
    else
        echo "Error: User certificate was not created."
    fi
}


# Step 3: Revoke a User Certificate
revoke_user_certificate() {
    read -p "Enter username to revoke: " USER_NAME
    USER_CERT="${CERTS_DIR}/${USER_NAME}.crt"

    if [ ! -f "${USER_CERT}" ]; then
        echo "Certificate for ${USER_NAME} not found."
        return
    fi

    echo "Revoking certificate for ${USER_NAME}..."
    openssl ca -config ${OPENSSL_CONFIG} -revoke ${USER_CERT}

    echo "Generating updated CRL..."
    openssl ca -config ${OPENSSL_CONFIG} -gencrl -out ${CRL_FILE}

    echo "Certificate for ${USER_NAME} revoked."
}

# Step 4: Sign a Document
sign_document() {
    read -p "Enter username: " USER_NAME
    read -p "Enter document file name: " DOCUMENT
    SIGNATURE="${DOCUMENT}.sig"
    USER_KEY="${USERS_DIR}/${USER_NAME}.key"

    if [ ! -f "${USER_KEY}" ]; then
        echo "Private key for ${USER_NAME} not found."
        return
    fi

    if [ ! -f "${DOCUMENT}" ]; then
        echo "Document file ${DOCUMENT} not found."
        return
    fi

    echo "Signing document ${DOCUMENT} with ${USER_NAME}'s private key..."
    openssl dgst -sha256 -sign ${USER_KEY} -out ${SIGNATURE} ${DOCUMENT}
    echo "Signature created: ${SIGNATURE}"
}

# Step 5: Verify a Document Signature
verify_signature() {
    read -p "Enter username: " USER_NAME
    read -p "Enter document file name: " DOCUMENT
    SIGNATURE="${DOCUMENT}.sig"
    USER_CERT="${CERTS_DIR}/${USER_NAME}.crt"

    if [ ! -f "${USER_CERT}" ]; then
        echo "Certificate for ${USER_NAME} not found."
        return
    fi

    if [ ! -f "${DOCUMENT}" ]; then
        echo "Document file ${DOCUMENT} not found."
        return
    fi

    if [ ! -f "${SIGNATURE}" ]; then
        echo "Signature file ${SIGNATURE} not found."
        return
    fi

    echo "Verifying signature..."
    openssl dgst -sha256 -verify <(openssl x509 -in ${USER_CERT} -pubkey -noout) \
        -signature ${SIGNATURE} ${DOCUMENT}

    if [ $? -eq 0 ]; then
        echo "Signature verification successful."
    else
        echo "Signature verification failed."
    fi
}

# Main menu loop
while true; do
    echo "PKI Management System"
    echo "1. Initialize CA"
    echo "2. Create User Certificate"
    echo "3. Revoke User Certificate"
    echo "4. Sign a Document"
    echo "5. Verify a Signature"
    echo "6. Exit"
    read -p "Choose an option: " CHOICE

    case $CHOICE in
        1) initialize_pki ;;
        2) create_user_certificate ;;
        3) revoke_user_certificate ;;
        4) sign_document ;;
        5) verify_signature ;;
        6) echo "Exiting..."; break ;;
        *) echo "Invalid option. Please try again." ;;
    esac
done
