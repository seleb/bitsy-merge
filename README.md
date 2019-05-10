# @bitsy/merge

merge tool for bitsy gamedata

notes:

- contents which don't overlap will be added without being changed
- contents which overlap will have their ids prefixed before being added, and references to their id will automatically be updated
- contents which overlap but are identical will not be added (e.g. if you start from a shared file, only changes will be added on merge)
- the contents of dialog scripts are not checked or updated; if you're referencing things from dialog (especially via hacks) you'll have to make sure that the names still line up post-merge manually
- variables which overlap will throw an error (variable overlaps need to be resolved manually since dialog contents aren't updated)
- make sure to choose a unique prefix: overlaps are not checked for prefixed conflict resolution

