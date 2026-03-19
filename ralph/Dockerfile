FROM eclipse-temurin:21.0.6_7-jdk-jammy

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    git \
    curl \
    openssh-client \
    maven \
    jq \
    ca-certificates \
    gnupg \
    gosu \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18 from NodeSource (Claude Code CLI requires Node 18+)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# install Claude Code CLI
RUN npm install -g @anthropic-ai/claude-code

# Create non-root user (--dangerously-skip-permissions requires non-root)
RUN useradd -m -s /bin/bash ralph

# SSH config for GitHub only (for non-root ralph user)
RUN mkdir -p /home/ralph/.ssh \
    && ssh-keyscan github.com >> /home/ralph/.ssh/known_hosts \
    && chmod 600 /home/ralph/.ssh/known_hosts \
    && printf "Host github.com\n  IdentityFile /home/ralph/.ssh/ralph_deploy_key\n  IdentitiesOnly yes\n" > /home/ralph/.ssh/config \
    && chmod 600 /home/ralph/.ssh/config \
    && chown -R ralph:ralph /home/ralph/.ssh

# Claude config dir and workspace owned by ralph
RUN mkdir -p /home/ralph/.claude && chown ralph:ralph /home/ralph/.claude
RUN mkdir -p /workspace /workspace/logs && chown -R ralph:ralph /workspace

WORKDIR /workspace

COPY ralph-loop.sh /usr/local/bin/ralph-loop.sh
RUN chmod +x /usr/local/bin/ralph-loop.sh

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["/bin/bash"]
