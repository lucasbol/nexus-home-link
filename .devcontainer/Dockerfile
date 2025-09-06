# Use the official .NET 9 SDK image as base
FROM mcr.microsoft.com/dotnet/sdk:9.0

# Install Node.js 20 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install pnpm globally
RUN npm install -g pnpm@latest

# Install additional development tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    unzip \
    zip \
    jq \
    vim \
    nano \
    htop \
    tree \
    && rm -rf /var/lib/apt/lists/*

# Install .NET tools
RUN dotnet tool install --global dotnet-ef --version 8.0.0 || true
RUN dotnet tool install --global dotnet-aspnet-codegenerator --version 8.0.0 || true
RUN dotnet tool install --global dotnet-ef --version 9.0.0 || true
RUN dotnet tool install --global dotnet-aspnet-codegenerator --version 9.0.0 || true

# Install Docker CLI (for Docker-in-Docker)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    gnupg \
    lsb-release \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && rm -rf /var/lib/apt/lists/*

# Create vscode user
RUN groupadd --gid 1000 vscode \
    && useradd --uid 1000 --gid vscode --shell /bin/bash --create-home vscode \
    && usermod -aG docker vscode

# Set up workspace directory
RUN mkdir -p /workspace && chown -R vscode:vscode /workspace

# Switch to vscode user
USER vscode
WORKDIR /workspace

# Set up .NET environment
ENV DOTNET_ROOT=/usr/share/dotnet
ENV PATH=$PATH:/usr/share/dotnet
ENV DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1

# Set up Node.js environment
ENV NODE_ENV=development

# Create a non-root user for Docker-in-Docker
RUN sudo groupadd -g 999 docker-host || true
RUN sudo usermod -aG docker-host vscode || true

# Set up shell
RUN echo 'export PATH=$PATH:/home/vscode/.dotnet/tools' >> /home/vscode/.bashrc
RUN echo 'alias ll="ls -la"' >> /home/vscode/.bashrc
RUN echo 'alias la="ls -la"' >> /home/vscode/.bashrc
RUN echo 'alias ..="cd .."' >> /home/vscode/.bashrc
RUN echo 'alias ...="cd ../.."' >> /home/vscode/.bashrc

# Keep container running
CMD ["sleep", "infinity"]
