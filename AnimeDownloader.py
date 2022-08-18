from requests import get
from bs4 import BeautifulSoap
from os import system
from webbrowser import open_new

def get_html_doc(url):
    return get(url).text

def bs4_data(url):
    return
BeautifulSoap(get_html_doc(url),'lxml')

def main_screep(url:str):
    'anime_info_body_bg'
    suop = bs4_data(url)
    # data = (suop.find('div',{'class':'play-video'}).find('iframe')['src'].split('/')[-1].split('¿))
    data = (suop.find('div',{'class':}))