// frontend/src/hooks/useAI.js
import { useState, useCallback } from "react";
import { api } from "../api/client";

export function useSkillContent(roleSlug) {
  const [contents, setContents] = useState({});  // { skillKey: markdown }
  const [loading, setLoading]   = useState({});
  const [errors, setErrors]     = useState({});

  const load = useCallback(async (skill, { refresh = false } = {}) => {
    if (!refresh && contents[skill]) return contents[skill];
    setLoading(p => ({ ...p, [skill]: true }));
    setErrors(p => ({ ...p, [skill]: null }));
    try {
      const { content } = await api.getSkill(skill, roleSlug, refresh);
      setContents(p => ({ ...p, [skill]: content }));
      return content;
    } catch (e) {
      setErrors(p => ({ ...p, [skill]: e.message }));
      throw e;
    } finally {
      setLoading(p => ({ ...p, [skill]: false }));
    }
  }, [roleSlug, contents]);

  return { contents, loading, errors, load };
}
