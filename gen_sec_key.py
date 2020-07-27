from binascii import hexlify
import os

def gen_key(length):
    return hexlify(os.urandom(length))
