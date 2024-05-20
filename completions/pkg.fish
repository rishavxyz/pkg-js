# completions
complete -f -c pkg -n "not __fish_seen_subcommand_from install" -a install -d 'install packages'
complete -f -c pkg -n "__fish_seen_subcommand_from i install" -a "(__fish_print_pacman_packages)"

complete -f -c pkg -n "not __fish_seen_subcommand_from remove" -a remove -d 'remove packages'
complete -f -c pkg -n "__fish_seen_subcommand_from rm remove" -a "(__fish_print_pacman_packages --installed)"

complete -f -c pkg -n "not __fish_seen_subcommand_from search" -a search -d 'search packages'
complete -f -c pkg -n "__fish_seen_subcommand_from s search" -a "(__fish_print_pacman_packages)"

complete -f -c pkg -n "not __fish_seen_subcommand_from find" -a find -d 'find packages'
complete -f -c pkg -n "__fish_seen_subcommand_from f find" -a "(__fish_print_pacman_packages)"

complete -f -c pkg -n "not __fish_seen_subcommand_from b backup" -a backup -d 'backup packages'
complete -f -c pkg -n "not __fish_seen_subcommand_from br backup-restore" -a backup-restore -d 'restore from backups'
complete -f -c pkg -n "not __fish_seen_subcommand_from bc backup-clean" -a backup-clean -d 'clean backups'
complete -f -c pkg -n "not __fish_seen_subcommand_from li list" -a list -d 'list packages'
