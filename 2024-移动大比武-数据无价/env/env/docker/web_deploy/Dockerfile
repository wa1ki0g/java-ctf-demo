FROM wa1ki0g/ctf_web



COPY bin/pushflag.sh /tmp/pushflag.sh
COPY bin/flag /tmp/flag
COPY bin/start.sh /tmp/start.sh

 
RUN cp /tmp/pushflag.sh / && \
    cp /tmp/start.sh / && \
    cp /tmp/flag /

RUN rm -rf /tmp/flag
RUN rm -rf /tmp/pushflag.sh
    
RUN chmod +x /pushflag.sh && \
    chmod +x /start.sh

CMD ["sh", "-c", "/start.sh"]
EXPOSE 8080