(() => {
  const username = "argaxpplgbr";
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const format = (n) => new Intl.NumberFormat("en").format(n);
  fetch(`https://api.github.com/users/${username}`, { headers: { Accept: "application/vnd.github+json" } })
    .then((response) => { if (!response.ok) throw new Error("GitHub profile unavailable"); return response.json(); })
    .then((profile) => {
      document.getElementById("stat-repos").textContent = format(profile.public_repos);
      document.getElementById("stat-followers").textContent = format(profile.followers);
      document.getElementById("stat-joined").textContent = `’${String(new Date(profile.created_at).getFullYear()).slice(-2)}`;
    }).catch(() => {});
  fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers: { Accept: "application/vnd.github+json" } })
    .then((response) => { if (!response.ok) throw new Error("Repositories unavailable"); return response.json(); })
    .then((repos) => {
      const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      document.getElementById("stat-stars").textContent = format(stars);
      const latest = repos.find((repo) => repo.name.toLowerCase() !== "argaxpplgbr" && repo.name.toLowerCase() !== "profil-web");
      if (!latest) return;
      const card = document.getElementById("repo-live");
      const title = card.querySelector("h3 a");
      title.href = latest.html_url;
      title.innerHTML = `${escapeText(latest.name)} <span>↗</span>`;
      card.querySelector("p").textContent = latest.description || "A public project from my GitHub profile — open it to explore the code.";
      card.querySelector(".repo-kind").textContent = "LATEST REPOSITORY";
      card.querySelector(".repo-meta").innerHTML = `<span>${escapeText(latest.language || "Open source")}</span><span>★ ${format(latest.stargazers_count)}</span>`;
    }).catch(() => {
      const copy = document.querySelector("#repo-live p");
      if (copy) copy.textContent = "Explore my public GitHub repositories and current experiments.";
    });
  function escapeText(value) { const node = document.createElement("span"); node.textContent = value; return node.innerHTML; }
})();
