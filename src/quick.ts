const go = async () => {
  const rawResponse = await fetch("https://ylgfjdlgyjmdikqavpcj.supabase.co/rest/v1/orbis_v_fol…:1:0xbf3a5599f2f6ce89862d640a248e31f30b7ddf29&active=eq.true", {
    headers: {
      apikey: this.apiKey,
    },
  });
  const response = await rawResponse.json();

  if (response.length === 0) {
    return false;
  }

  const isFollowing = response.length[0].active === "true";
  return isFollowing;
}
go();
